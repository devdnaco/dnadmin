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

  const { reports } = useReportData();

  const searchParams = useSearchParams();
  const branch = searchParams.get('branch');
  const cat = searchParams.get('cat');
  const page = searchParams.get('page');
  
  if (!branch || !cat || !page) {
    return (
        <p className='w-full mt-10 text-center text-white'>Invalid link</p>
    )
  }

    return (
      <div className="w-full min-h-screen flex flex-col p-10">
      <span
          onClick={() => router.back()}
          className="cursor-pointer flex flex-row self-start gap-1 text-base items-center font-medium text-white transform duration-75 hover:-translate-x-1"
        >
          <ChevronLeftIcon className="w-4 h-4" /> Back
        </span>

        <p className='text-white/90 font-bold text-3xl mt-5'>Edit Page</p>
        <p className='text-white/70 font-medium text-base'>Editing: {branch} branch</p>

        <div className='mt-6 flex flex-col items-center w-full'>
            { (!reports) ? <LoadingIndicator/> : reports[branch][cat][page].pages.map((block, i) => (
                <div key={i} className='mt-4 w-full max-w-2xl'>
                <p className='mb-1 w-full font-black text-xs text-white/80'>{block.note ? 'Note Block' : block.intro ? 'Intro Block' : block.text ? 'Text Block' : block.geneList ? 'Gene List Block' : block.geneInfo ? 'Gene Info Block' : block.outcomes ? 'Outcome Block' : 'Unknown'}</p>
                <div className='p-5 rounded-lg bg-gray-100/20 flex flex-col justify-center text-white'>
                {block.title && <p>{block.title}</p>}
                { block.intro && <p className='text-sm'>{block.intro}</p> }
                { block.text && <p className='text-sm'>{block.text}</p> }
                { block.note && <p className='text-sm text-white/70'>{block.note}</p> }
                { block.geneList && <div className='flex gap-3'> { block.geneList.map((gene) => (
                    <div key={gene} className='mt-3'>
                        <p className='text-sm'>{gene}</p>
                    </div>
                ))}</div>
                }
                { block.geneInfo && block.geneInfo.map((geneInfo) => (
                    <div key={geneInfo[0]} className='mt-3'>
                        <p className='mb-2 font-bold'>{geneInfo[0]}</p>
                        <div className='p-3 rounded-lg bg-gray-100/20 flex flex-col gap-2'>
                        { Object.keys(geneInfo[1]).map((allele) => (
                            <p key={allele}><span className='font-medium'>{allele}</span>: {geneInfo[1][allele]}</p>
                        ))}
                        </div>
                    </div>
                ))}
                { block.outcomes && block.outcomes.map((outcome) => (
                    <div key={outcome.gene} className='mt-3'>
                        <p className='mb-2 font-bold'>{outcome.gene}</p>
                        <div className='p-3 rounded-lg bg-gray-100/20 flex flex-col gap-2'>
                        { Object.keys(outcome.text).map((result) => (
                            <p key={result}><span className='font-medium'>{result}</span>: {outcome.text[result]}</p>
                        ))}
                        </div>
                    </div>
                ))}
                </div>
                </div>
            ))}
        </div>
      </div>
    );
}
