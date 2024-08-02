import React from 'react';
import MyTODOList from './components/table';
import MyFilter from './components/filters';


const App: React.FC = () => {
  
  
    const token = process.env.JWT_TOKEN as string;
  
  return (
    <>
      <MyFilter />
      <MyTODOList token={token} />
    </>
  )
}

export default App;
