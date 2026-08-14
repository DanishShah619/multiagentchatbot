import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import { auth, googleProvider } from '../../utils/firebase'
import api from '../../utils/axios'
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from 'react-redux';
import { setUserdata } from '../redux/userSlice';
import SideBar from '../components/SideBar';
import ChatArea from '../components/ChatArea';
import Artifact from '../components/Artifact';

function Home() {
    const {userData}=useSelector(state=>state.user)
    const dispatch=useDispatch()
    const handleLogin = async (token) => {
        try {
            const { data } = await api.post("/api/auth/login", { token })
            dispatch(setUserdata(data))
        } catch (error) {
            console.log(error)
        }
    }


    const googleLogin = async () => {
        try {
            const data = await signInWithPopup(auth, googleProvider)
            const token = await data.user.getIdToken()
            await handleLogin(token)
        } catch (error) {
            console.error("[googleLogin]", error)
        }
    }
    return (
        <div className='h-screen  flex bg-[#0d0f14] text-white overflow-hidden'>

<SideBar/>
<ChatArea/>
<Artifact/>




{!userData && (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4'>
        <div className='w-[360px] bg-[#13151c] border border-white/[0.1] rounded-2xl p-7 flex flex-col gap-5 shadow-2xl'>
            <div className='flex flex-col gap-1 text-center'>
                <h2 className='text-xl font-bold text-white tracking-tight'>Welcome to QuantumAI</h2>
                <p className='text-xs text-slate-400'>Please authenticate to enter your multi-agent workspace.</p>
            </div>

            <button 
                className='w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 transition-all duration-150 cursor-pointer shadow-lg' 
                onClick={googleLogin}
            >
                <FcGoogle size={18} />
                <span>Continue With Google</span>
            </button>

            <a 
                href="/" 
                className='text-center text-xs text-slate-500 hover:text-slate-300 transition-colors pt-2'
            >
                ← Return to QuantumAI Landing Page
            </a>
        </div>
    </div>
)}
          
        </div>
    )
}

export default Home
