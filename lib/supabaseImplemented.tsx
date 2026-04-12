import { supabase } from "./database";
import { TaskDetail, TaskStatus, User } from "./type";

type NewTask = Omit<TaskDetail, "id">;
export type TaskInsert = Omit<TaskDetail, "id">;
// fix later
export const addNewTask = async (task: NewTask) => {


  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: task.user_id,
      title: task.title,
      subtitle: task.subtitle,
      description: task.description,
      start_date: task.start_date,
      end_date: task.end_date,
      start_time: task.start_time,
      end_time: task.end_time,
      status: task.status,
    }
    )
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    throw error;
  }
  console.log("Add Task: ", data);
  return data ?? null;
}

export const getTaskDetail = async (userId: string): Promise<TaskDetail[]> => {
  const { data, error } = await supabase
    .from("tasks")
    .select('*')
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw error;

  return (data as TaskDetail[]).map((row) => ({
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    start_date: row.start_date,
    end_date: row.end_date,
    start_time: row.start_time,
    end_time: row.end_time,
    status: row.status as TaskStatus,
  }));
}

export const updateTaskDetail = async (taskId: string, updates: Partial<Omit<TaskDetail, "id">>) => {
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", taskId)
    .select()
    .single();
  if (error) throw error;
  console.log("Update Task:", data);
  return data;
}
export const deleteTask = async (taskId: string) => {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId);
  if (error) throw error;
}
//================================ USER
export const getUserId = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return;
  }
  return user.id;
}
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error
  }
  return data.user;
}
export const getUserProfile = async (): Promise<User | null> => {
  const user = await getCurrentUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();
  if (error) {
    console.log("Get profile error:", error);
    return null;
  }
  return data as User;
}
export const checkEmailExists = async (email: string) => {
  const { data, } = await supabase
    .from("users")
    .select("email")
    .eq("email", email)
    .single();

  if (data) return true;
  return false;
};
export const addUser = async (
  email: string,
  password: string,
  first_name: string,
  last_name: string,
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  const userId = data?.user?.id ?? data.session?.user?.id;
  if (userId) {
    const { error: insertError } = await supabase.from("users")
      .insert({
        id: userId,
        email: email,
        first_name: first_name,
        last_name: last_name,
      })
    if (insertError) throw insertError;
  }
  return data;
}
//============ TodoList
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
}
export const getTodos = async (userId: string) => {
  const today = getTodayDate();
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", userId)
    .eq('date', today)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export const addTodo = async (userId: string, title: string) => {
  const { data, error } = await supabase
    .from("todos")
    .insert({
      user_id: userId,
      title,
      is_completed: false,
      date: getTodayDate(),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
export const toggleTodo = async (todoId: number, isCompleted: boolean) => {
  const { error } = await supabase
    .from("todos")
    .update({ is_completed: isCompleted })
    .eq("id", todoId);
  if (error) throw error;
}
export const deleteTodo = async (todoId: number) => {
  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", todoId);
  if (error) throw error;
}