// HOOK LAYER

import { useContext } from "react";

import { AuthContext } from "../auth.context";

import {register, login, getMe, logOut} from '../services/auth.api'

import { useEffect } from "react";

export const useAuth = ()=>{
    const context = useContext(AuthContext);

    const {user, setUser, loading, setLoading} = context;


    // handle register
    async function handleRegister({username, email, password}){
        setLoading(true)
        try{
        const data = await register({username, email, password})
        setUser(data.user)
        return true
        }
        catch(err){
            console.error("REGISTER ERROR:", err)
            return false
        }finally{                          
        setLoading(false)  
        } 
    }


    // handle login

    async function handleLogin({ email, password }) {
      setLoading(true);

      try {
        const data = await login({ email, password });
        setUser(data.userResponse);
        return true;
      } catch (err) {
        console.error("LOGIN ERROR:", err);
        return false;
      } finally {
        setLoading(false);
      }
    }

    // handle getMe
    async function handleGetMe() {
      setLoading(true);

      try {
        const data = await getMe();
        setUser(data.user);
      } catch (err) {
        console.error("GET ME ERROR:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }


    // handle logout
    async function handleLogOut(){
        setLoading(true)
        try{
        const data = await logOut()
        setUser(data.user)
        return true
        }
        catch(err){
            console.error("LOGOUT ERROR:", err)
            return false
        }
        finally{
            setLoading(false)
        }
    }

    // it will run once when the component mounts, and it will call the handleGetMe function to fetch the current user's data.
    useEffect(()=>{
        handleGetMe()
    }, [])

    return ({user, loading, handleRegister, handleLogin, handleGetMe, handleLogOut})

}