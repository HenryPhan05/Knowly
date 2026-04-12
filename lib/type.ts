
export type User = {
  id: string;
  first_name: string,
  last_name: string,
  email: string,
  avatar_url: string | null,
}

export type TaskStatus = 'Not started' | 'In progress' | 'Done!';
export type Task = {
  id: string,
  user_id: string,
  title: string,
  subtitle: string,
  start_date: string,
  end_date: string,
  start_time: string,
  end_time: string,
}
export type TaskDetail = Task & {
  description: string
  status: TaskStatus
}

export type Todo = {
  id: string,
  title: string,
  is_completed: boolean;
  date: string;
}