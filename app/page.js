'use client';

import React, { useEffect, useMemo, useState } from 'react';

export default function DataEntryApp() {

const empty={
losNum:'',
loanType:'FRESH',
city:'',
customerName:'',
companyName:'',
contactNum:'',
tlName:'',
executive:'',
status:'DDE',
netAmount:'',
grossAmount:'',
disburseDate:''
};

const [form,setForm]=useState(empty);
const [rows,setRows]=useState([]);
const [search,setSearch]=useState('');
const [fileName,setFileName]=useState('loan_master');

useEffect(()=>{

if(typeof window !== 'undefined'){

const savedName=localStorage.getItem('master_file_name');

if(savedName){
setFileName(savedName);
}

const savedData=localStorage.getItem(
`master_excel_data_${savedName || 'loan_master'}`
);

if(savedData){
setRows(JSON.parse(savedData));
}

}

},[]);

useEffect(()=>{

if(typeof window !== 'undefined'){
localStorage.setItem(
`master_excel_data_${fileName}`,
JSON.stringify(rows)
);

localStorage.setItem(
'master_file_name',
fileName
);
}

},[rows,fileName]);

const onChange=(e)=>{
setForm({
...form,
[e.target.name]:e.target.value
});
};

const addRow=()=>{
if(!form.customerName || !form.losNum) return;

setRows(prev=>[
...prev,
{
...form,
id:Date.now()
}
]);

setForm(empty);
};

const exportCsv=()=>{

const headers=[
'SR NO',
'LOS NUM',
'TYPE OF LOAN',
'CITY',
'CUSTOMER NAME',
'COMPANY NAME',
'CONTACT NUM',
'TL NAME',
'EXECUTIVE',
'STATUS',
'NET AMOUNT',
'GROSS AMOUNT',
'DISBURSE DATE'
];

const csv=[
headers.join(','),
...rows.map((r,i)=>[
i+1,
r.losNum,
r.loanType,
r.city,
r.customerName,
r.companyName,
r.contactNum,
r.tlName,
r.executive,
r.status,
r.netAmount,
r.grossAmount,
r.disburseDate
].join(','))
].join('\n');

const blob=new Blob([csv],{
type:'text/csv'
});

const a=document.createElement('a');

const url=URL.createObjectURL(blob);

a.href=url;

a.download=`${fileName}.csv`;

a.click();

URL.revokeObjectURL(url);

};

const filtered=useMemo(
()=>rows.filter(r=>
(r.customerName||'')
.toLowerCase()
.includes(search.toLowerCase())
||
(r.losNum||'')
.includes(search)
),
[rows,search]
);

return (

<div style={{padding:'20px',fontFamily:'Arial'}}>

<h1>LOS CRM App</h1>

<h3>Master File Name</h3>

<input
value={fileName}
onChange={(e)=>setFileName(e.target.value)}
style={{padding:'8px',marginBottom:'20px'}}
/>

<button
onClick={exportCsv}
style={{marginLeft:'10px'}}
>
Export Excel
</button>

<hr/>

<h2>New Case Entry</h2>

<input name="losNum" placeholder="LOS NUM" value={form.losNum} onChange={onChange}/><br/><br/>

<select name="loanType" value={form.loanType} onChange={onChange}>
<option>FRESH</option>
<option>TOPUP</option>
<option>BT+TOPUP</option>
</select><br/><br/>

<input name="city" placeholder="CITY" style={{
padding:'10px',
width:'100%'
}}value={form.city} onChange={onChange}/><br/><br/>

<input name="customerName" placeholder="CUSTOMER NAME" style={{
padding:'10px',
width:'100%'
}}value={form.customerName} onChange={onChange}/><br/><br/>

<input name="companyName" placeholder="COMPANY NAME" style={{
padding:'10px',
width:'100%'
}}value={form.companyName} onChange={onChange}/><br/><br/>

<input name="contactNum" placeholder="CONTACT NUM"style={{
padding:'10px',
width:'100%'
}} value={form.contactNum} onChange={onChange}/><br/><br/>

<input name="tlName" placeholder="TL NAME" style={{
padding:'10px',
width:'100%'
}}value={form.tlName} onChange={onChange}/><br/><br/>

<input name="executive" placeholder="EXECUTIVE" style={{
padding:'10px',
width:'100%'
}}value={form.executive} onChange={onChange}/><br/><br/>

<select name="status" value={form.status} onChange={onChange}>
<option>DDE</option>
<option>VERIFICATION</option>
<option>APPROVED</option>
<option>DISBURSED</option>
<option>FTNR</option>
<option>MDR</option>
<option>REJECTED</option>
</select><br/><br/>

<input name="netAmount" placeholder="NET AMOUNT" value={form.netAmount} onChange={onChange}/><br/><br/>

<input name="grossAmount" placeholder="GROSS AMOUNT" value={form.grossAmount} onChange={onChange}/><br/><br/>

<input type="date" name="disburseDate" value={form.disburseDate} onChange={onChange}/><br/><br/>

<button onClick={addRow}>
Append To File
</button>

<hr/>

<h2>Search</h2>

<input
placeholder="Search LOS/Customer"
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<hr/>

<h2>Cases ({rows.length})</h2>

{filtered.map((r,idx)=>(

<div
key={r.id}
style={{
border:'1px solid gray',
padding:'10px',
marginBottom:'10px'
}}
>

<b>
SR {idx+1} | {r.customerName} | {r.losNum}
</b>

<br/>

{r.loanType} | {r.status} | {r.city}

<br/>

Net ₹{r.netAmount}
|
Gross ₹{r.grossAmount}

</div>

))}

</div>

);

}
