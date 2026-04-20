'use client';
import React, { useEffect, useMemo, useState } from 'react';

export default function DataEntryApp() {
  const [fileName,setFileName]=useState('loan_master');
  const [rows,setRows]=useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('master_file_name');
      if (savedName) setFileName(savedName);
    }
  }, []);

  return (
    <div>
      LOS CRM App
    </div>
  );
}
