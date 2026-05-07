import { Request, Response } from 'express';
import Task from '../models/Task';
import Project from '../models/Project';
import { logProjectActivity } from '../utils/activityLogger';
import { sendNotification } from '../utils/notificationHelper';

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectId = req.body.projectId as string;
    const task = await Task.create(req.body);
    
    // Log activity
    await logProjectActivity(
      projectId,
      task.assigneeId,
      'general',
      `New task assigned: ${task.title}`,
      task.description,
      `/project/${projectId}`
    );

    await sendNotification(
      task.assigneeId,
      'project_task',
      'New Task Assigned',
      `You have been assigned a new task: ${task.title}`,
      { actionUrl: `/project/${projectId}`, projectId }
    );

    res.status(201).json({ success: true, data: task });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getProjectTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectId = req.params.projectId as string;
    const tasks = await Task.find({ projectId })
      .populate('assigneeId', 'name avatar')
      .sort({ dueDate: 1 });
      
    res.json({ success: true, data: tasks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const tasks = await Task.find({ assigneeId: userId })
      .populate('projectId', 'title status')
      .sort({ dueDate: 1 });
      
    res.json({ success: true, data: tasks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const task = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }
    
    res.json({ success: true, data: task });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const submitTaskWork = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = ((req as any).user?._id || req.body.userId) as string;
    
    const task = await Task.findById(id);
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    const newSubmission = {
      ...req.body,
      userId,
      version: task.submissions.length + 1
    };
    
    task.submissions.push(newSubmission);
    task.status = 'in-review';
    
    await task.save();

    // Notify host
    const project = await Project.findById(task.projectId);
    if (project) {
      await logProjectActivity(
        project._id,
        project.hostId,
        'task_submitted',
        `Task submitted for review: ${task.title}`,
        `Participant has submitted work for ${task.title}`,
        `/project/${project._id}`
      );

      await sendNotification(
        project.hostId,
        'project_review',
        'Task Submitted',
        `Work has been submitted for review: ${task.title}`,
        { actionUrl: `/project/${project._id}`, projectId: project._id }
      );
    }
    
    res.status(201).json({ success: true, data: task });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const reviewTaskSubmission = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body; // status: 'done' or 'revision'
    const reviewerId = (req as any).user?._id || req.body.reviewerId;

    const task = await Task.findById(id);
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    // Update the latest submission with feedback
    if (task.submissions.length > 0) {
      const lastSubmission = task.submissions[task.submissions.length - 1];
      lastSubmission.reviewStatus = status === 'done' ? 'approved' : 'needs-revision';
      lastSubmission.feedback.push({
        authorId: reviewerId,
        comment: feedback,
        type: status === 'done' ? 'approval' : 'revision',
        createdAt: new Date()
      });
    }

    task.status = status;
    await task.save();

    // Log activity
    await logProjectActivity(
      task.projectId,
      task.assigneeId,
      status === 'done' ? 'review_given' : 'task_rejected',
      status === 'done' ? `Task approved: ${task.title}` : `Task needs revision: ${task.title}`,
      feedback,
      `/project/${task.projectId}`
    );

    await sendNotification(
      task.assigneeId,
      'project_review',
      status === 'done' ? 'Task Approved!' : 'Task Revision Requested',
      status === 'done' 
        ? `Great job! Your task "${task.title}" has been approved.` 
        : `Your task "${task.title}" needs some adjustments. Check the feedback.`,
      { actionUrl: `/project/${task.projectId}`, projectId: task.projectId }
    );

    // If task is done, update project progress
    if (status === 'done') {
      const totalTasks = await Task.countDocuments({ projectId: task.projectId });
      const completedTasks = await Task.countDocuments({ projectId: task.projectId, status: 'done' });
      const progress = Math.round((completedTasks / totalTasks) * 100);
      
      await Project.findByIdAndUpdate(task.projectId, { progress });
    }

    res.json({ success: true, data: task });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

