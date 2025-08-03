
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AnalyzeTaxDocumentOutput, AnalyzeTaxDocumentInput } from '@/ai/flows/analyze-tax-document';

export interface Report {
    id: string;
    name: string;
    createdAt: string;
    result: AnalyzeTaxDocumentOutput;
    inputs: {
      country: string;
      analysisType: string;
      taxYear: string;
    }
}

const HISTORY_STORAGE_KEY = 'tax-analysis-history';

export const useHistory = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        try {
            const storedHistory = window.localStorage.getItem(HISTORY_STORAGE_KEY);
            if (storedHistory) {
                setReports(JSON.parse(storedHistory));
            }
        } catch (error) {
            console.error("Failed to load history from localStorage", error);
        }
    }, []);

    const saveReports = (updatedReports: Report[]) => {
        try {
            setReports(updatedReports);
            window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedReports));
        } catch (error) {
            console.error("Failed to save history to localStorage", error);
        }
    };

    const addReport = useCallback((report: Report) => {
        if (!isMounted) return;
        const updatedReports = [...reports, report];
        saveReports(updatedReports);
    }, [reports, isMounted]);

    const deleteReport = useCallback((reportId: string) => {
        if (!isMounted) return;
        const updatedReports = reports.filter(report => report.id !== reportId);
        saveReports(updatedReports);
    }, [reports, isMounted]);

    const updateReportName = useCallback((reportId: string, newName: string) => {
        if (!isMounted) return;
        const updatedReports = reports.map(report =>
            report.id === reportId ? { ...report, name: newName } : report
        );
        saveReports(updatedReports);
    }, [reports, isMounted]);

    const getReportById = useCallback((reportId: string): Report | undefined => {
        if (!isMounted) return undefined;
        return reports.find(report => report.id === reportId);
    }, [reports, isMounted]);
    
    const clearHistory = useCallback(() => {
       if (!isMounted) return;
       saveReports([]);
    }, [isMounted]);

    return { reports, addReport, deleteReport, updateReportName, getReportById, clearHistory, isMounted };
};
