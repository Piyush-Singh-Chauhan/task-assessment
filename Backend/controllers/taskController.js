import Task from '../models/Task.js';

// Create a new task
export const createTask = async (req, res) => {
    try {
        const { title, description , status } = req.body;

        if(!title) {
            return res.status(400).json({
                message: "Title is required"
            })
        }
        const task = await Task.create({
            title,
            description,
            status,
            user: req.user._id,
        })
        res.status(201).json(task);
    } catch (error) {
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
        const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
        if (!task) {
            return res.status(404).json({ message: "Task not found or unauthorized" });
        }
        res.status(200).json(task);
    } catch (error) {
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