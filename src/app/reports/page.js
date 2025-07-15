"use client";
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useSearchParams } from 'next/navigation';
import {VideoCameraIcon, PhotoIcon, FolderIcon, CogIcon} from '@heroicons/react/24/solid';
import LoadingIndicator from '../LoadingIndicator';
import { ChevronLeftIcon, ChevronRightIcon, EditIcon, EyeIcon } from 'lucide-react';
import { useReportData } from '@/lib/ReportsContext';

export default function Home() {
    const router = useRouter();

  const { reportCategories, reports } = useReportData();

  const searchParams = useSearchParams();
  const branch = searchParams.get('branch') || 'test';
  
  
    return (
      <div className="w-full min-h-screen flex flex-col p-10">
      <span
          onClick={() => router.back()}
          className="cursor-pointer flex flex-row self-start gap-1 text-base items-center font-medium text-white transform duration-75 hover:-translate-x-1"
        >
          <ChevronLeftIcon className="w-4 h-4" /> Back
        </span>

        <p className='text-white/90 font-bold text-3xl mt-5'>Reports</p>
        <p className='text-white/70 font-medium text-base'>Editing: {branch} branch</p>

        <div className='mt-6'>
            { (!reports || !reportCategories) ? <LoadingIndicator/> : Object.keys(reportCategories[branch]).map((category) =>
                <div className='p-5 w-full max-w-2xl rounded-lg bg-gray-100/20 flex flex-col justify-center mt-4 text-white' key={category}>
                    <p className='text-white/90 text-lg font-medium mb-1'>{reportCategories[branch][category].name}</p>
                    { Object.keys(reports[branch][category]).map((page) => (
                        <p onClick={() => router.push(`/page?branch=${branch}&cat=${category}&page=${page}`)} className='cursor-pointer text-white/80 text-sm flex gap-0.5 items-center' key={page}>{page} <ChevronRightIcon className='w-4 h-4'/></p>
                    ))}
                </div>
            )}
        </div>
      </div>
    );
}
