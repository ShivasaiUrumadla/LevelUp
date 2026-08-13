  import React from 'react'
  import { useEffect,useState,useRef} from 'react';
  import { AddTaskDialog } from "@/components/AddTaskDialog";
  import { TaskCard } from "@/components/TaskCard";
  

  function Dashborad() {
    const [tasks,setTask]=useState([]);
    const [load,setLoad]=useState(true)
    const [todayProgress, setTodayProgress] = useState({});
    const [balance, setBalance] = useState({});
    const timers = useRef({});
    const token=localStorage.getItem("token");
    const API = import.meta.env.VITE_API_URL;
      useEffect(() =>{
        async function load(){
      // fetch("http://127.0.0.1:5000/tasks")
      //   .then(res=> res.json())
      //   .then((data) => {
      //     setTask(data);
      //     setLoad(false)
      //   } 
      // )
      
      const taskres= await fetch(`${API}/tasks`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      const taskdata= await taskres.json();

      const progressres= await fetch(`${API}/progress`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
        });
      const progressdata= await progressres.json();
      
      setTask(taskdata)
      console.log(taskdata[0])
      setTodayProgress(progressdata.today_progress);
      setBalance(progressdata.balance);

      // const progressres= await fetch("http://127.0.0.1:5000/progress",{
      //   method:"POST",
      //   header:{
      //     "content-Type":"application/json"
      //   },
      //   body:json.stringify(task)
      // });
      

      setLoad(false)

      }
      load();

      }
  ,[]);



  async function updatetask(title_,target_,unit_){
  try{
    const response=await fetch(`${API}/settask`,{
      method:"POST",
      headers:{"Content-Type":"application/json",
                Authorization: `Bearer ${token}`
      },
      body:JSON.stringify({
        title:title_,
        target:target_,
        unit:unit_
      }),
    });
    if(!response.ok){
    throw new Error("Failed to update progress"); 
    }
    const data = await response.json();
      console.log(data);
      setTask(prev => [...prev, data]);
  }catch(error){
      console.error("Error updating backend:", error)
  }
  }



  function updateprogress(taskID, newValue) {
  clearTimeout(timers.current[taskID]);

  timers.current[taskID] = setTimeout(async () => {
    try {
      const response = await fetch(`${API}/setprogress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          task_id: taskID,
          progress: newValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update progress");
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }, 1500);
}

  async function deleteTask(taskID){
    try{
      const response =await fetch(`${API}/tasks/${taskID}`,{
      method:"DELETE",
      headers:{Authorization: `Bearer ${token}`}
      
      });
      if(!response.ok){
        throw new Error("Failed to delete task");
      }
      setTask(prevTasks =>
      prevTasks.filter(task => task.id !== taskID)
      );
    }catch (error) {
      console.error(error);

    }
  };



  const decreaseProgress = (taskId) => {
    const task = tasks.find(t => t.id === taskId);

    if (!task) return;

    // calculate today's new progress
    const newToday = (todayProgress[taskId] ?? 0) - 1;
    console.log("newToday", newToday);
    // update raw today progress
    setTodayProgress(prev => ({
      ...prev,
      [taskId]: newToday
    }));

    // update displayed balance
    setBalance(prev => ({
      ...prev,
      [taskId]: (prev[taskId] ?? -task.target) - 1
    }));

    // save today's progress to backend
    updateprogress(taskId, newToday);
  };
    
  const increaseProgress = (taskId) => {
    const task = tasks.find(t => t.id === taskId);

    if (!task) return;

    const newToday = (todayProgress[taskId] ?? 0) + 1;

    setTodayProgress(prev => ({
      ...prev,
      [taskId]: newToday
    }));

    setBalance(prev => ({
      ...prev,
      [taskId]: (prev[taskId] ?? -task.target) + 1
    }));

    updateprogress(taskId, newToday);
  };

  const onAdd=(data)=>{
      
      updatetask(data.title,data.target,data.unit)
  }

    return (
      
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
          <header className="flex flex-row items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                <h1>gggggg</h1>
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                <p>today's tasks</p>
              </h1>
              <p className="mt-2 text-muted-foreground">
                0 of {tasks.length} done — keep the streak going.
                  
              </p>
            </div>
            <div className="shrink-0 pt-6">
                  <AddTaskDialog onAdd={onAdd}/>
              
              
            </div>
          </header>

          <section className="mt-10">
            
              
            
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {tasks.map((task)=>(
                    <TaskCard key={task.id} task={task} value={balance[task.id] ?? task.target} onIncrement={()=>increaseProgress(task.id)} onDecrement={()=>decreaseProgress(task.id)} onDelete={()=>deleteTask(task.id)} />
                  ))}
                  
                
              </div>
            
          </section>

          <section className="mt-12">
            
          </section>

          <footer className="mt-12 text-center text-xs text-muted-foreground">
            Saved locally on this device.
          </footer>
        </div>
      </div>
    )

  }

  export default Dashborad