import { Request, Response } from 'express';
import Application from '../models/Application';
import Project from '../models/Project';
import { logProjectActivity } from '../utils/activityLogger';
import { sendNotification } from '../utils/notificationHelper';

export const applyToProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectId = req.params.projectId as string;
    const userId = ((req as any).user?._id || req.body.userId) as string;
    
    // Check if application already exists
    const existingApp = await Application.findOne({ projectId, userId });
    if (existingApp) {
      res.status(400).json({ success: false, message: 'You have already applied to this project' });
      return;
    }

    const application = await Application.create({
      ...req.body,
      projectId,
      userId
    });

    // Notify host
    const project = await Project.findById(projectId);
    if (project) {
      await logProjectActivity(
        projectId,
        project.hostId,
        'new_applicant',
        `New application for ${project.title}`,
        `A participant has applied for a role.`,
        `/project/${projectId}`
      );

      await sendNotification(
        project.hostId,
        'project_hiring',
        'New Applicant!',
        `A new participant has applied to your project: ${project.title}`,
        { actionUrl: `/project/${projectId}`, projectId }
      );
    }
    
    res.status(201).json({ success: true, data: application });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getUserApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const applications = await Application.find({ userId })
      .populate('projectId', 'title status cohortId hostId')
      .sort({ appliedAt: -1 });
      
    res.json({ success: true, data: applications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjectApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectId = req.params.projectId as string;
    const applications = await Application.find({ projectId })
      .populate('userId', 'name avatar skills')
      .sort({ appliedAt: -1 });
      
    res.json({ success: true, data: applications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    const project = await Project.findById(application.projectId);

    // If status is 'hired', we should ideally update the Project's role filled status
    if (status === 'hired') {
      await Project.updateOne(
        { _id: application.projectId, 'roles._id': application.roleId },
        { 
          $set: { 
            'roles.$.filled': true,
            'roles.$.assignedUserId': application.userId 
          },
          $inc: { currentParticipants: 1 }
        }
      );

      if (project) {
        await logProjectActivity(
          application.projectId,
          application.userId,
          'accepted',
          `You've been hired for ${project.title}!`,
          `Welcome to the team. You can now start working on tasks.`,
          `/project/${application.projectId}`
        );

        await sendNotification(
          application.userId,
          'project_hiring',
          'Hired!',
          `Congratulations! You have been hired for ${project.title}.`,
          { actionUrl: `/project/${application.projectId}`, projectId: application.projectId }
        );
      }
    } else if (status === 'shortlisted') {
      if (project) {
        await logProjectActivity(
          application.projectId,
          application.userId,
          'accepted',
          `You've been shortlisted for ${project.title}`,
          `The host is reviewing your profile. Stay tuned!`,
          `/project/${application.projectId}`
        );

        await sendNotification(
          application.userId,
          'project_hiring',
          'Shortlisted!',
          `You've been shortlisted for ${project.title}. The mentor will review your profile soon.`,
          { actionUrl: `/project/${application.projectId}`, projectId: application.projectId }
        );
      }
    } else if (status === 'rejected') {
      if (project) {
        await sendNotification(
          application.userId,
          'project_hiring',
          'Application Update',
          `Your application for ${project.title} was not selected this time. Keep exploring!`,
          { projectId: application.projectId }
        );
      }
    }
    
    res.json({ success: true, data: application });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

