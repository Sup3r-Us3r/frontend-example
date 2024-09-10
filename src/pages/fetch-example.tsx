import { useFetcher } from '../hooks/useFetcher';

interface ITodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const Home = () => {
  const {
    loading: loadingTodos,
    data: todosData,
    error: todosError,
  } = useFetcher<ITodo>('https://jsonplaceholder.typicode.com/todos/1');

  return (
    <div>
      {loadingTodos && <h1>Loading...</h1>}

      {todosData && <pre>{JSON.stringify(todosData, null, 2)}</pre>}

      {todosError && <h1>{todosError?.message}</h1>}
    </div>
  );
};

export default Home;
