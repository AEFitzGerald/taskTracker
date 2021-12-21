import Header from './components/Header';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import Footer from './components/Footer';
import About from './components/About';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { useState, useEffect } from 'react'
import './App.css';

function App() {
    const [ showAddTask, setShowAddTask] = useState(false)
    const [ tasks, setTasks] = useState ([])


    useEffect(() => {
        const getTasks = async () => {
            const tasksFromServer = await fetchTasks()
            setTasks( tasksFromServer )           
        }
        
        getTasks()
    }, [])

        //Fetch Tasks
        const fetchTasks = async () => {
            const res = await fetch ('http://localhost:5000/tasks')
            const data= await res.json()
            console.log(data)
            return data
        }

         //Fetch Task
        const fetchTask = async (id) => {
            const res = await fetch (`http://localhost:5000/tasks/${id}`)
            const data= await res.json()
            console.log(data)
            return data
        }
    
        // Add Task 
        const addTask = async (task) => {
            const res = await fetch('http://localhost:5000/tasks', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(task)
            })

            //promise await res.json
            const data = await res.json()
            
            //take existing tasks and add onto it the new task 
            setTasks([...tasks, data])

            // const id = Math.floor(Math.random() * 10000) + 1
            // const newTask = { id, ...task }
            // setTasks([...tasks, newTask])
            // console.log(task)
        } 

        // Delete Task
        const deleteTask = async ( id ) => {
            await fetch(`http://localhost:5000/tasks/${id}`, {
                method: 'DELETE'
            })

            setTasks(tasks.filter( (task ) => task.id !== id ) )
        }

        // Toggle Reminder
        const toggleReminder = async ( id ) => {
            const taskToToggle = await fetchTask(id)
            const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }

            const res = await fetch(`http://localhost:5000/tasks/${id}`, {
                method:'PUT',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringigy(updTask),
            })

            const data = await res.json()

            setTasks(
                tasks.map(( task )=> 
                    task.id === id ? { ...task, reminder: !task.reminder } : task
                )
            )
        }   


    return (
    <Router>
        <div className="container">
            <Header 
                onAdd ={() => setShowAddTask( !showAddTask )} 
                showAdd= { showAddTask } 
                title='Task Tracker'
                />
                <Routes>
                    <Route 
                        path='/' 
                        element={
                            <>
                            { showAddTask && <AddTask onAdd= { addTask } /> }
                
                            { tasks.length > 0 ? (
                                <Tasks 
                                    tasks={ tasks } 
                                    onDelete={ deleteTask } 
                                    onToggle= { toggleReminder }
                                />
                                ):(
                                    'You have no tasks'
                                )}
                            </>
                        }
                    />
                    <Route path='/about' element={ <About /> }/>
                </Routes> 
            <Footer />  
        </div>
    </Router>
    )
}

export default App;
