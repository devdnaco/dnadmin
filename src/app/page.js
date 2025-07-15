"use client";
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import {VideoCameraIcon, PhotoIcon, FolderIcon, CogIcon} from '@heroicons/react/24/solid';
import LoadingIndicator from './LoadingIndicator';
import { BoxIcon, Calculator, FileChartColumnIcon, LeafyGreenIcon, LogOutIcon, MailIcon, SettingsIcon, UserIcon } from 'lucide-react';

export default function Home() {
  const [tab, setTab] = useState(0);

  const router = useRouter();

  const AppIcon = ({name, icon, route}) => (
    <div onClick={() => router.push(route)} className='flex flex-col items-center hover:scale-105 transform duration-75 cursor-pointer'>
      <div className='w-32 h-32 rounded-xl gap-4 bg-gray-100/20 flex items-center justify-center'>
      {icon}
    </div>
      <p className="text-center font-medium text-lg text-white/75">{name}</p>
    </div>
  );
  
    return (
      <div className="w-full min-h-screen flex flex-col p-6 pt-10 items-center justify-center">

      <div>
        <div className='flex flex-row justify-between h-9'>
        <div className='flex flex-row gap-2'>
          <div onClick={() => setTab(0)} className={`rounded-lg p-1 px-2 self-start bg-gray-100/20 transform duration-75 flex items-center justify-center ${tab === 0 ? ' rounded-b-none pb-2' : 'hover:scale-105 cursor-pointer'}`}>
            <p className='text-white/90 font-medium'>Main Branch</p>
          </div>
          <div onClick={() => setTab(1)} className={`rounded-lg p-1 px-2 self-start bg-gray-100/20 transform duration-75 flex items-center justify-center ${tab === 1 ? ' rounded-b-none pb-2' : 'hover:scale-105 cursor-pointer'}`}>
            <p className='text-white/90 font-medium'>Test Branch</p>
          </div>
        </div>

        <div className='flex flex-row gap-2'>
          <div onClick={() => {}} className='rounded-lg p-1 px-2 self-start bg-gray-700/20 transform duration-75 flex items-center justify-center hover:scale-105 cursor-pointer'>
            <p className='text-white/90 font-medium flex gap-1 items-center'><SettingsIcon className='w-4 h-4'/> Settings</p>
          </div>
          <div onClick={() => {}} className='rounded-lg p-1 px-2 self-start bg-red-600/20 transform duration-75 flex items-center justify-center hover:scale-105 cursor-pointer'>
            <p className='text-white/90 font-medium flex gap-1 items-center'><LogOutIcon className='w-4 h-4'/> Log Out</p>
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-lg bg-gray-100/20 flex flex-col justify-center ${tab === 0 && 'rounded-tl-none'}`}>
      <p className='text-white/90 font-semibold text-2xl'>Welcome back!</p>
      <p className='text-white/70 text-sm pb-4'>Editing: {tab === 0 ? 'Main Branch' : 'Test Branch'}</p>
          <div className='flex flex-row gap-4'>
            <AppIcon name="Users" icon={<UserIcon className='w-20 h-20 text-[#220022] opacity-60'/>} route={`/users?branch=${tab === 0 ? 'main' : 'test'}`}/>
            <AppIcon name="Orders" icon={<BoxIcon className='w-20 h-20 text-[#220022] opacity-60'/>} route={`/orders?branch=${tab === 0 ? 'main' : 'test'}`}/>
            <AppIcon name="Results" icon={<Calculator className='w-20 h-20 text-[#220022] opacity-60'/>} route={`/results?branch=${tab === 0 ? 'main' : 'test'}`}/>
            <AppIcon name="Reports" icon={<FileChartColumnIcon className='w-20 h-20 text-[#220022] opacity-60'/>} route={`/reports?branch=${tab === 0 ? 'main' : 'test'}`}/>
            <AppIcon name="Emails" icon={<MailIcon className='w-20 h-20 text-[#220022] opacity-60'/>} route={`/emails?branch=${tab === 0 ? 'main' : 'test'}`}/>
          </div>
      </div>

      </div>
      </div>
    );
}
