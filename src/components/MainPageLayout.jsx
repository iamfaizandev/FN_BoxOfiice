import React from 'react';
import Navs from './nav';
import Title from './Title';

const MainPageLayout = ({children}) => {
  return (
    <div>
        <Title title="Box-Office" subtitle="Are you looking for a movie or an actor?" />
     <Navs />     
      {children}

    </div>
  )
}

export default MainPageLayout;