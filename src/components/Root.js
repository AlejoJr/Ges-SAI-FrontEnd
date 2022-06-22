import React from "react";

import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import SignIn from "./SignIn";
import ContainerHosts from "./hosts/ContainerHosts";
import Host from "./hosts/Host";
import Group from "./groups/Group";
import Users from "./users/Users";
import User from "./users/User";
import Sais from "./sais/Sais";
import Sai from "./sais/Sai";
import Battery from "./sais/Battery";
import Pools from "./pools/Pools";
import Pool from "./pools/Pool";

import Home from "./utils/Home";
import ResponsiveAppBar from "./utils/AppBar";
import NotFoundPage from "./utils/NotFoundPage";

// <<-- Hook Personalizado -->>
import {useToken, useIsTechnical} from "../customHooks/useToken";
import Dependence from "./groups/Dependence";
import Instructions from "./utils/Instructions";



function Root() {

    // <<-- | G U A R D A R - E L - T O K E N - E N - L A - S E S S I O N  ( E N  - U N - H O O K)  |-->
    const {token, setToken} = useToken();
    const {isTechnical, setIsTechnical} = useIsTechnical();

    if (!token) {
        return <SignIn setToken={setToken} setIsTechnical={setIsTechnical}/>
    }

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<ResponsiveAppBar/>}>
                        <Route index element={<Home/>}/>
                        <Route path="hosts" element={<ContainerHosts/>}/>
                        <Route path="host/:idHost" element={<Host/>}/>
                        <Route path="host/:idHost/group/:idGroup" element={<Host/>}/>
                        {isTechnical ? <Route path="users" element={<Users/>}/> : <Route path="*" element={<NotFoundPage/>}/>}
                        {isTechnical ? <Route path="user/:idUser" element={<User/>}/> : <Route path="*" element={<NotFoundPage/>}/>}
                        {isTechnical ? <Route path="sais" element={<Sais/>}/> : <Route path="*" element={<NotFoundPage/>}/>}
                        {isTechnical ? <Route path="sai/:idSai" element={<Sai/>}/> : <Route path="*" element={<NotFoundPage/>}/>}
                        {isTechnical ? <Route path="battery" element={<Battery/>}/> : <Route path="*" element={<NotFoundPage/>}/>}
                        <Route path="dependences" element={<Dependence/>}/>
                        <Route path="pools" element={<Pools/>}/>
                        <Route path="pool/:idPool" element={<Pool/>}/>
                        <Route path="instructions" element={<Instructions/>}/>
                        {/*<Route path="pool/:idPool/group/:idGroup" element={<Group/>}/>
                            <Route path="group/:idGroup" element={<Group/>}/>*/}
                        <Route path="*" element={<NotFoundPage/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default Root