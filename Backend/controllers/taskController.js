import Task from '../models/Task.js';
import validator from 'validator';

// Create a new task
export const createTask = async (req, res) => {
    try {
        const { title, description , status } = req.body;

        // Validate inputs
        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({ message: "Title is required and must be a non-empty string" });
        }
        
        if (description && typeof description !== 'string') {
            return res.status(400).json({ message: "Description must be a string" });
        }
        
        const validStatuses = ['pending', 'in-progress', 'completed'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status. Valid statuses are: pending, in-progress, completed" });
        }
        
        const task = await Task.create({
            title: title.trim(),
            description: description ? description.trim() : '',
            status: status || 'pending',
            user: req.user._id,
        });
        res.status(201).json(task);
    } catch (error) {
        console.error('Task creation error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get all tasks for a user
export const getTasks = async (req, res) => {
    try{
        const tasks = await Task.find({user : req.user._id}).sort({ createdAt: -1 });
        res.status(200).json(tasks)
    } catch(err){
        res.status(500).json({ message: err.message});
    }
};

// Update a task
export const updateTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        
        // Validate inputs
        if (title && (typeof title !== 'string' || title.trim().length === 0)) {
            return res.status(400).json({ message: "Title must be a non-empty string" });
        }
        
        if (description && typeof description !== 'string') {
            return res.status(400).json({ message: "Description must be a string" });
        }
        
        const validStatuses = ['pending', 'in-progress', 'completed'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status. Valid statuses are: pending, in-progress, completed" });
        }
        
        const updateData = {};
        if (title) updateData.title = title.trim();
        if (description) updateData.description = description.trim();
        if (status) updateData.status = status;
        
        const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, updateData, { new: true });
        if (!task) {
            return res.status(404).json({ message: "Task not found or unauthorized" });
        }
        res.status(200).json(task);
    } catch (error) {
        console.error('Task update error:', error);
        res.status(500).json({ message: error.message });
    }
}

// Delete a task
export const deleteTask = async (req, res) =>{
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if(!task){
            return res.status(404).json({ message: "Task not found"})
        }

        res.status(200).json({message : "Task deleted successfully"});
    } catch (err) {
        res.status(500).json({message : "Task deletion failed"});
    }
}