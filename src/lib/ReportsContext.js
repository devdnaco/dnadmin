// lib/ResultsContext.js
"use client";
import { updateResults } from "@/api/calls";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const ReportsContext = createContext();
const provider = '292448b8-6438-47b7-9408-7d8f03ea4a37';

export const ReportsProvider = ({ children }) => {
    const [reportDataLoading, setReportDataLoading] = useState(true);
    const [reports, setReports] = useState(null);
    const [reportCategories, setReportCategories] = useState(null);
    const [results, setResults] = useState(null);

    const addVariable = async (branch, name, returns_num, outcomes) => {
        const newResults = {...results[branch], [name]: {returns_num, outcomes}}
        const success = await updateResults(branch, newResults);
        if (!success) return false;
        setResults({...results, [branch]: newResults});
        return true;
    }

    const removeVariable = async (branch, name) => {
        const newResults = {...results[branch]};
        delete newResults[name];
        const success = await updateResults(branch, newResults);
        if (!success) return false;
        setResults({...results, [branch]: newResults});
        return true;
    }

    useEffect(() => {
        const fetchData = async () => {
            const { data: reportCatData, error: reportCatError } = await supabase
                .from('report_categories')
                .select()
                .eq('provider', provider);

            if (reportCatError) {
            console.error('Fetch error:', error.message);
            return;
            }

            const reportCatDict = {};
            for (const reportCat of reportCatData) {
                if (reportCat.branch) {
                    if (!(reportCat.branch in reportCatDict)) reportCatDict[reportCat.branch] = {};
                    reportCatDict[reportCat.branch][reportCat.id] = reportCat;
                }
            }
            setReportCategories(reportCatDict);

            const { data: reportsData, error: reportsError } = await supabase
                .from('reports')
                .select()
                .eq('provider', provider);

            if (reportsError) {
            console.error('Fetch error:', error.message);
            return;
            }

            const reportsDict = {};
            for (const report of reportsData) {
                if (report.branch) reportsDict[report.branch] = report.data;
            }
            setReports(reportsDict);
                
            const { data: resultsData, error: resultsError } = await supabase
                .from('results')
                .select()
                .eq('provider', provider);

            if (resultsError) {
            console.error('Fetch error:', error.message);
            return;
            }

            const resultsDict = {};
            for (const result of resultsData) {
                if (result.branch) resultsDict[result.branch] = result.data;
            }
            setResults(resultsDict);

            setReportDataLoading(false);
        };

        if (reportDataLoading) fetchData();
    }, []);

    return (
        <ReportsContext.Provider value={{ reports, reportCategories, results, addVariable, removeVariable, reportDataLoading }}>
            {children}
        </ReportsContext.Provider>
    );
};

export const useReportData = () => useContext(ReportsContext);
