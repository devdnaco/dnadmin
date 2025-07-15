"use client";
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import {VideoCameraIcon, PhotoIcon, FolderIcon, CogIcon} from '@heroicons/react/24/solid';
import LoadingIndicator from '../LoadingIndicator';
import { ChevronLeftIcon, DownloadIcon, EditIcon, TrashIcon } from 'lucide-react';
import { fetchResults } from '../../api/calls';
import { saveAs } from 'file-saver';
import { useSearchParams } from 'next/navigation';
import { useReportData } from '@/lib/ReportsContext';

export default function Home() {
  const router = useRouter();

  const { results, removeVariable } = useReportData();

  const searchParams = useSearchParams();
  const branch = searchParams.get('branch') || 'test';

  function getVariablesUsedInKey(key) {
    const usedVars = new Set();
    if (results[branch][key] === null) return;

    for (const outcome of Object.values(results[branch][key]['outcomes'])) {
      if (outcome === 'default') continue;
      for (const cnd of outcome) {
        if (cnd.type === 'conditional') {
          for (const k in cnd.conditions) usedVars.add(k);
        } else if (cnd.type === 'comparitor') {
          for (const k in cnd.vals) usedVars.add(k);
        }
      }
    }

    return [...usedVars];
  }

  function getVariablesThatUse(key) {
    const users = [];

    for (const alt_key of Object.keys(results[branch])) {
      const vars = getVariablesUsedInKey(alt_key);
      if (vars.includes(key)) {
        users.push(alt_key);
      }
    }

    return users;
  }

  const [searchTerm, setSearchTerm] = useState("");
  const filteredResults = useMemo(() => {
    if (!results || !results[branch]) return {};
    return Object.fromEntries(
      Object.entries(results[branch]).filter(([key]) =>
        key.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, results]);

  function handleDownloadCSV() {
    if (!results[branch]) return;
    const csvRows = [["Variable", "Used In Conversion", "Used By"]];
    
    for (const key of Object.keys(results[branch])) {
      const usedIn = getVariablesUsedInKey(key).join(", ");
      const usedBy = getVariablesThatUse(key).join(", ");
      csvRows.push([key, usedIn, usedBy]);
    }

    const csvContent = csvRows.map(e => e.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, "results.csv");
  }

  function handleDownloadJSON() {
    if (!results[branch]) return;
    const jsonContent = JSON.stringify(results[branch], null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    saveAs(blob, "results.json");
  }

    return (
      <div className="w-full min-h-screen flex flex-col p-10">
      <span
          onClick={() => router.back()}
          className="cursor-pointer flex flex-row self-start gap-1 text-base items-center font-medium text-white transform duration-75 hover:-translate-x-1"
        >
          <ChevronLeftIcon className="w-4 h-4" /> Back
        </span>

      <p className='text-white/90 font-bold text-3xl mt-5'>Results</p>
      <p className='text-white/70 font-medium text-base'>Editing: {branch} branch</p>

        <div className='w-full flex flex-col items-center mt-6'>

        <div className="flex flex-row gap-3 items-center">
          <button onClick={() => router.push(`/variable/?branch=${branch}`)} className="bg-purple-200/50 text-white px-4 py-1 rounded-md text-sm hover:bg-purple-300/50">
            Add New Variable
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
          <button
            onClick={handleDownloadJSON}
            className="bg-purple-800/50 text-white px-4 py-1 rounded-md text-sm hover:bg-purple-900/50 flex items-center gap-2"
          >
            <DownloadIcon className='w-4 h-4'/>
            Download JSON
          </button>
        </div>

        <div className='w-full max-w-4xl p-5 rounded-lg bg-gray-100/20 flex flex-col items-center justify-center mt-4 text-white'>
            { !results ? <LoadingIndicator/> : <table className="w-full text-sm text-left table-fixed">
            <thead className="text-white border-b">
                <tr>
                <th className="w-40 px-4 py-2 whitespace-normal break-words border-r border-white/20">Variable Name</th>
                <th className="px-4 py-2 whitespace-normal break-words border-r border-white/20">Values Used in Formula</th>
                <th className="px-4 py-2 whitespace-normal break-words border-r border-white/20">Variables Using This Result</th>
                <th className="w-20 px-2 py-2 border-r border-white/20">Edit</th>
                <th className="w-20 px-2 py-2">Delete</th>
                </tr>
            </thead>
            <tbody>
                { filteredResults && Object.keys(filteredResults).map((result) => (
                  <tr key={result} className='border-b border-white/50'>
                    <td className="px-4 py-2 font-medium whitespace-normal break-words">{result}</td>
                    <td className="px-4 py-2 space-x-1">
                    { getVariablesUsedInKey(result).map((name) => (
                      <span key={name} className={`inline-block max-w-[6rem] truncate text-ellipsis whitespace-nowrap overflow-hidden ${(name in results[branch]) ? 'bg-purple-200 text-purple-900' : 'bg-green-200 text-green-900'} px-2 py-1 rounded-full`}>
                        {name}
                      </span>
                    ))}
                    </td>
                    <td className="px-4 py-2 space-x-1 whitespace-normal break-words">
                    {(() => {
                      const allVars = getVariablesThatUse(result);
                      const shownVars = allVars.slice(0, 5);
                      const extraCount = allVars.length - shownVars.length;

                      return (
                        <>
                          {shownVars.map((name) => (
                            <span
                              key={name}
                              className="inline-block max-w-[6rem] truncate text-ellipsis whitespace-nowrap overflow-hidden bg-purple-200 text-purple-900 px-2 py-1 rounded-full"
                            >
                              {name}
                            </span>
                          ))}
                          {extraCount > 0 && (
                            <span className="inline-block max-w-[6rem] truncate text-ellipsis whitespace-nowrap overflow-hidden bg-purple-200 text-purple-900 px-2 py-1 rounded-full">
                              +{extraCount}
                            </span>
                          )}
                        </>
                      );
                    })()}
                    </td>
                    <td className="px-4 py-2 whitespace-normal break-words">
                        <button className='cursor-pointer' onClick={() => router.push(`/variable?branch=${branch}&variable=${result}`)}><EditIcon color='#ffDDAAA0' className='w-5 h-5'/></button>
                    </td>
                    <td className="px-4 py-2 whitespace-normal break-words">
                        <button className='cursor-pointer' onClick={() => removeVariable(branch, result)}><TrashIcon color='#ffAAAAA0' className='w-5 h-5'/></button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>}
        </div>
        </div>
      </div>
    );
}
