import { Router } from 'express';
import { 
  getProjectTasks, 
  getUserTasks, 
  updateTaskStatus, 
  submitTaskWork,
  createTask,
  reviewTaskSubmission
} from '../controllers/taskController';

const router = Router();

router.post('/', createTask);
router.get('/project/:projectId', getProjectTasks);
router.get('/user/:userId', getUserTasks);
router.patch('/:id/status', updateTaskStatus);
router.post('/:id/submit', submitTaskWork);
router.post('/:id/review', reviewTaskSubmission);

export default router;

