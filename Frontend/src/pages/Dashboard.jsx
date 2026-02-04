import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../api/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pending'
  });
  
  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filteredTasks, setFilteredTasks] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter tasks based on search term and status
  useEffect(() => {
    let filtered = tasks;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }
    
    setFilteredTasks(filtered);
  }, [tasks, searchTerm, filterStatus]);



  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTasks();
      setTasks(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value
    });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const response = await taskAPI.createTask(newTask);
      setTasks([response.data, ...tasks]);
      setNewTask({ title: '', description: '', status: 'pending' });
      setShowForm(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add task');
    }
  };

  const handleUpdateTask = async (taskId, status) => {
    try {
      const response = await taskAPI.updateTask(taskId, { status });
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data : task
      ));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.deleteTask(taskId);
        setTasks(tasks.filter(task => task._id !== taskId));
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800';
      case 'in-progress':
        return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800';
      case 'completed':
        return 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'in-progress':
        return '🔄';
      case 'completed':
        return '✅';
      default:
        return '📋';
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    const pending = tasks.filter(task => task.status === 'pending').length;
    
    return { total, completed, inProgress, pending };
  };

  const stats = getTaskStats();

  return (
    <div className="flex h-full bg-gradient-to-br from-blue-50 to-teal-50">
      <main className="flex-1 pb-8">
        <div className="px-6 py-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-amber-400 to-orange-400">
                    <span className="text-2xl text-white">{getStatusIcon('pending')}</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-400 to-green-400">
                    <span className="text-2xl">{getStatusIcon('completed')}</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-400">
                    <span className="text-2xl text-white">{getStatusIcon('in-progress')}</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-amber-400 to-orange-400">
                    <span className="text-2xl">{getStatusIcon('pending')}  </span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search tasks by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            
            {/* Add Task Section */}
            <div className="mb-8">
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600  text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 font-medium"
              >
                <span className="mr-2 text-xl">+</span>
                {showForm ? 'Cancel' : 'Add New Task'}
              </button>
            </div>

            {/* Add Task Form */}
            {showForm && (
              <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Task</h2>
                <form onSubmit={handleAddTask} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Task Title *
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={newTask.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        placeholder="Enter task title"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={newTask.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={newTask.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      placeholder="Enter task description (optional)"
                    ></textarea>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                    >
                      Create Task
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {/* Tasks List */}
            {!loading && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Your Tasks</h3>
                  <p className="text-sm text-gray-500 mt-1">{filteredTasks.length} tasks found</p>
                </div>
                
                {filteredTasks.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-4xl">📋</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
                    </h3>
                    <p className="text-gray-500">
                      {tasks.length === 0 ? 'Create your first task to get started!' : 'Try adjusting your search or filter criteria.'}
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {filteredTasks.map((task) => (
                      <li key={task._id} className="px-6 py-5 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center mb-2">
                              <span className="text-xl mr-3">{getStatusIcon(task.status)}</span>
                              <h4 className="text-lg font-medium text-gray-900 truncate">
                                {task.title}
                              </h4>
                              <span className={`ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                                {task.status.replace('-', ' ')}
                              </span>
                            </div>
                            
                            {task.description && (
                              <p className="text-gray-600 mb-3">
                                {task.description}
                              </p>
                            )}
                            
                            <div className="flex items-center text-sm text-gray-500">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Created {new Date(task.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3 ml-4">
                            <select
                              value={task.status}
                              onChange={(e) => handleUpdateTask(task._id, e.target.value)}
                              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete task"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    
  );
};

export default Dashboard;