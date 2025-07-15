"use client";
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useSearchParams } from 'next/navigation';
import {VideoCameraIcon, PhotoIcon, FolderIcon, CogIcon} from '@heroicons/react/24/solid';
import LoadingIndicator from '../LoadingIndicator';
import { ChevronLeftIcon, DownloadIcon, EditIcon, EyeIcon } from 'lucide-react';
import { saveAs } from 'file-saver';

export default function Home() {
  const router = useRouter();
  
    const searchParams = useSearchParams();
    const branch = searchParams.get('branch') || 'test';

  const orders = {
    "main": [
        {
            'id': 123094231,
            'user': 'wyldevin@gmail.com',
            'status': 'Shipping'
        },
        {
            'id': 123094232,
            'user': 'sarah@gmail.com',
            'status': 'Shipping'
        },
        {
            'id': 123094233,
            'user': 'markymark@gmail.com',
            'status': 'Shipping'
        },
        {
            'id': 123094234,
            'user': 'notatest@gmail.com',
            'status': 'Shipping'
        },
        {
            'id': 123094235,
            'user': 'actuallyatest@gmail.com',
            'status': 'Shipping'
        }
    ]
  };

  const [searchTerm, setSearchTerm] = useState("");
    const filteredOrders = useMemo(() => {
      if (!orders || !orders[branch]) return {};
      return orders[branch].filter((order) =>
          order.user.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, orders]);
  
    function handleDownloadCSV() {
      if (!orders[branch]) return;
      const csvRows = [["User", "Status"]];
      
      for (const order of orders[branch]) {
        csvRows.push([order.user, order.status]);
      }
  
      const csvContent = csvRows.map(e => e.map(v => `"${v}"`).join(",")).join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, "orders.csv");
    }
  
  
    return (
      <div className="w-full min-h-screen flex flex-col p-10">
      <span
          onClick={() => router.back()}
          className="cursor-pointer flex flex-row self-start gap-1 text-base items-center font-medium text-white transform duration-75 hover:-translate-x-1"
        >
          <ChevronLeftIcon className="w-4 h-4" /> Back
        </span>

      <p className='text-white/90 font-bold text-3xl mt-5'>Orders</p>
      <p className='text-white/70 font-medium text-base'>Editing: {branch} branch</p>

       <div className='w-full flex flex-col items-center mt-6'>

        <div className="flex flex-row gap-3 items-center">
          <button onClick={() => router.push(`/order/?branch=${branch}`)} className="bg-purple-200/50 text-white px-4 py-1 rounded-md text-sm hover:bg-purple-300/50">
            Add New Order
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
                <th className="px-4 py-2 whitespace-normal break-words border-r border-white/50">User</th>
                <th className="px-4 py-2 whitespace-normal break-words">Status</th>
                </tr>
            </thead>
            <tbody>
            { filteredOrders && Object.values(filteredOrders).map(order => (
                <tr key={order.id} className='border-b border-white/50'>
                    <td className="px-4 py-2 whitespace-normal break-words">{order.user}</td>
                    <td className="px-4 py-2 whitespace-normal break-words">{order.status}</td>
                </tr>
            ))}
            </tbody>
            </table>
        </div>
        </div>
      </div>
    );
}
