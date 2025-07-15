"use client";
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import {VideoCameraIcon, PhotoIcon, FolderIcon, CogIcon} from '@heroicons/react/24/solid';
import LoadingIndicator from '../LoadingIndicator';
import { ChevronLeftIcon, DownloadIcon, EditIcon, EyeIcon } from 'lucide-react';
import { saveAs } from 'file-saver';

export default function Home() {
  const router = useRouter();
  
    const [branch, setBranch] = useState('test');

    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      if (params && params.get('branch')) setBranch(params.get('branch'));
    }, []);

  const Divider = () => (
    <div className='w-[1px] h-5 bg-black/50'/>
  );

  const users = {
    "main": [
        {
            'id': 123094231,
            'first_name': 'Devin',
            'last_name': 'Wylde',
            'email': 'wyldevin@gmail.com',
            'level': 'Admin'
        },
        {
            'id': 123094232,
            'first_name': 'Sarah',
            'last_name': 'James',
            'email': 'sarah@gmail.com',
            'level': 'User'
        },
        {
            'id': 123094233,
            'first_name': 'Mark',
            'last_name': 'Smith',
            'email': 'markymark@gmail.com',
            'level': 'User'
        },
        {
            'id': 123094234,
            'first_name': 'Test',
            'last_name': 'User',
            'email': 'notatest@gmail.com',
            'level': 'User'
        },
        {
            'id': 123094235,
            'first_name': 'Real',
            'last_name': 'User',
            'email': 'actuallyatest@gmail.com',
            'level': 'User'
        }
    ]
  };

  const [searchTerm, setSearchTerm] = useState("");
    const filteredUsers = useMemo(() => {
      if (!users || !users[branch]) return {};
      return users[branch].filter((user) =>
          user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, users]);
  
    function handleDownloadCSV() {
      if (!users[branch]) return;
      const csvRows = [["Email", "First Name", "Last Name", "Permissions"]];
      
      for (const user of users[branch]) {
        csvRows.push([user.email, user.first_name, user.last_name, user.level]);
      }
  
      const csvContent = csvRows.map(e => e.map(v => `"${v}"`).join(",")).join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, "users.csv");
    }
  
  
    return (
      <div className="w-full min-h-screen flex flex-col p-10">
      <span
          onClick={() => router.back()}
          className="cursor-pointer flex flex-row self-start gap-1 text-base items-center font-medium text-white transform duration-75 hover:-translate-x-1"
        >
          <ChevronLeftIcon className="w-4 h-4" /> Back
        </span>

      <p className='text-white/90 font-bold text-3xl mt-5'>Users</p>
      <p className='text-white/70 font-medium text-base'>Editing: {branch} branch</p>

       <div className='w-full flex flex-col items-center mt-6'>

        <div className="flex flex-row gap-3 items-center">
          <button onClick={() => router.push(`/user/?branch=${branch}`)} className="bg-purple-200/50 text-white px-4 py-1 rounded-md text-sm hover:bg-purple-300/50">
            Add New User
          </button>
          <input
            type="text"
            placeholder="Search"
            className="px-3 py-1 rounded-md text-white bg-white/40 text-sm focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleDownloadCSV}
            className="bg-purple-800/50 text-white px-4 py-1 rounded-md text-sm hover:bg-purple-900/50 flex items-center gap-2"
          >
            <DownloadIcon className='w-4 h-4'/>
            Download Table
          </button>
        </div>

        <div className='w-full max-w-4xl p-5 rounded-lg bg-gray-100/20 flex flex-col items-center justify-center mt-4 text-white'>
            <table className="w-full text-sm text-left table-fixed">
            <thead className="text-white border-b">
                <tr>
                <th className="px-4 py-2 whitespace-normal break-words border-r border-white/50">Email</th>
                <th className="px-4 py-2 whitespace-normal break-words border-r border-white/50">First Name</th>
                <th className="px-4 py-2 whitespace-normal break-words border-r border-white/50">Last Name</th>
                <th className="px-4 py-2 whitespace-normal break-words border-r border-white/50">Permissions</th>
                <th className="w-24 px-2 py-2 border-r border-white/20">Details</th>
                <th className="w-24 px-2 py-2">View Kits</th>
                </tr>
            </thead>
            <tbody>
            { filteredUsers && Object.values(filteredUsers).map(user => (
                <tr key={user.id} className='border-b border-white/50'>
                    <td className="px-4 py-2 whitespace-normal break-words">{user.email}</td>
                    <td className="px-4 py-2 whitespace-normal break-words">{user.first_name}</td>
                    <td className="px-4 py-2 whitespace-normal break-words">{user.last_name}</td>
                    <td className="px-4 py-2 whitespace-normal break-words">{user.level}</td>
                    <td className="px-4 py-2"><EditIcon className="w-4 h-4" color='#ffffffA0'/></td>
                    <td className="px-4 py-2"><EyeIcon className="w-4 h-4" color='#ffffffA0'/></td>
                </tr>
            ))}
            </tbody>
            </table>
        </div>
        </div>
      </div>
    );
}
