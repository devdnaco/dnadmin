"use client";
import { useRouter } from "next/navigation";
import { act, useEffect, useState } from "react";
import { ChevronLeft, ChevronLeftIcon, DeleteIcon, MinusCircleIcon, MinusIcon, PlusCircleIcon, PlusIcon, TrashIcon } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { genes, typeToList } from "@/data/genes";
import LoadingIndicator from "../LoadingIndicator";
import { useReportData } from "@/lib/ReportsContext";

export default function Home() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const { results, addVariable, reportDataLoading } = useReportData();

  const [branch, setBranch] = useState('test');
  const [editingVariable, setEditingVariable] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params && params.get('branch')) setBranch(params.get('branch'));
    if (params && params.get('variable')) setEditingVariable(params.get('variable'));
  }, []);

  const [variableName, setVariableName] = useState("");
  const [returnType, setReturnType] = useState(0);
  const [outcomes, setOutcomes] = useState({});
  const [activeOutcome, setActiveOutcome] = useState(null);
  const [addingGeneIndex, setAddingGeneIndex] = useState(null);
  

  useEffect(() => {
    const loadResults = async () => {
      if (results && results[branch]) {
        if (editingVariable) {
            if (editingVariable in results[branch]) {
                setVariableName(editingVariable);
                const outcomes = {...results[branch][editingVariable]['outcomes']};
                setOutcomes(outcomes);
                if (Object.keys(outcomes).length > 0) setActiveOutcome(Object.keys(outcomes)[0]);
                setLoading(false);
            }
        } else setLoading(false);
      } else setLoading(true);
    };

    loadResults();
  }, [reportDataLoading]);

    const handleAddOutcome = () => {
        const name = prompt("Enter new outcome name:");
        if (!name) return;
        if (returnType === 1 && isNaN(Number(name))) {
            alert("Only numeric outcome names are allowed when Return Type is 'Number'.");
            return;
        }
        if (!(name in outcomes)) {
            setOutcomes({ ...outcomes, [name]: [] });
            setActiveOutcome(name);
        }
    };
  
  const handleAddGene = (i) => {
    setAddingGeneIndex(i);
  }

  const handleAddConditionalBlock = () => {
    const current = [...outcomes[activeOutcome], {type: 'conditional', conditions: {}}];
    updateLogic(activeOutcome, current);
  };

  const handleAddSumBlock = () => {
    const current = [...outcomes[activeOutcome], {type: 'comparitor', vals: [], comparitor: '>', check: 0}];
    updateLogic(activeOutcome, current);
  };

  const updateLogic = (outcome, newData) => {
    console.log(newData);
    setOutcomes({...outcomes, [outcome]: newData});
  }

  const handleSave = async () => {
    if (variableName.length === 0 || Object.keys(outcomes).length === 0) return;
    for (const outcome of Object.values(outcomes)) {
        if (outcome === 'default') continue;
        for (const opt of outcome) {
            if (opt.type === 'conditional') {
                if (Object.keys(opt.conditions).length === 0) return;
                for (const val of Object.values(opt.conditions)) if (!val || val.length === 0) return;
            } else if (opt.type === 'comparitor') {
                if (opt.vals.length === 0) return;
            } else return;
        }
    }

    if (!loadingSave) {
        setLoadingSave(true);
        const success = await addVariable(branch, variableName, returnType === 1, outcomes);
        if (success) router.back();
        else alert('The outcome failed to save.');
        setLoadingSave(false);
    }
  };

    const handleDeleteBlock = (i) => {
        setAddingGeneIndex(null);
        const current = [...outcomes[activeOutcome]];
        current.splice(i, 1);
        updateLogic(activeOutcome, current);
    };

    const handleDeleteOutcome = () => {
        if (!confirm(`Delete outcome "${activeOutcome}"?`)) return;
        const newOutcomes = { ...outcomes };
        delete newOutcomes[activeOutcome];
        setOutcomes(newOutcomes);
        if (Object.keys(newOutcomes).length === 0) setActiveOutcome(null);
        else setActiveOutcome(Object.keys(newOutcomes)[0]);
    };

    const handleDeleteGene = (i, gene) => {
        const current = [...outcomes[activeOutcome]];
        if (current[i].type === 'comparitor') {
            current[i].vals = current[i].vals.filter((g) => g !== gene);
        } else if (current[i].type === 'conditional') {
            delete current[i].conditions[gene];
        }
        
        updateLogic(activeOutcome, current);
    };

    const handleMakeDefault = () => {
        if (outcomes[activeOutcome].length > 0 && !confirm(`Remove any existing logic in "${activeOutcome}"?`)) return;
        const newOutcomes = { ...outcomes };
        for (const out of Object.keys(newOutcomes)) if (newOutcomes[out] === 'default') newOutcomes[out] = [];
        newOutcomes[activeOutcome] = 'default';
        setOutcomes(newOutcomes);
    }

  const GeneAdder = ({idx, sum}) => {
        const values = sum ? [...Object.keys(genes).filter(g => genes[g] === 6), ...Object.keys(results[branch]).filter(r => results[branch][r].returns_num)] : [...Object.keys(genes), ...Object.keys(results[branch])];
        const [query, setQuery] = useState("");
        const [filtered, setFiltered] = useState(values);

        useEffect(() => {
            setFiltered(
            values.filter((g) => g.toLowerCase().includes(query.toLowerCase()))
            );
        }, [query]);

        return (
            <div className="relative w-64">
            <input
                autoFocus
                type="text"
                className="w-full px-2 py-1 border rounded"
                placeholder="Search Value"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => setTimeout(() => setAddingGeneIndex(null), 200)} // delay for click
            />
            <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto bg-white border border-gray-300 rounded shadow">
                {filtered.length === 0 ? (
                <div className="px-2 py-1 text-sm text-gray-500">No matches</div>
                ) : (
                filtered.map((gene) => (
                    <div
                    key={gene}
                    onClick={() => {
                        const current = [...outcomes[activeOutcome]];
                        if (outcomes[activeOutcome][idx].type === 'comparitor') {
                        current[idx]['vals'] = [...current[idx]['vals'], gene];
                        } else {
                        current[idx]['conditions'] = {
                            ...current[idx]['conditions'],
                            [gene]: [],
                        };
                        }
                        updateLogic(activeOutcome, current);
                        setAddingGeneIndex(null);
                    }}
                    className="px-2 py-1 text-sm hover:bg-purple-100 cursor-pointer"
                    >
                    {gene}
                    </div>
                ))
                )}
            </div>
            </div>
        );
    };

    const hasNonNumericOutcomes = () => {
        return Object.keys(outcomes).some((key) => isNaN(Number(key)));
    };

  return (
    <div className="w-full min-h-screen flex flex-col p-10">
      <span
          onClick={() => router.back()}
          className="cursor-pointer flex flex-row self-start gap-1 text-base items-center font-medium text-white transform duration-75 hover:-translate-x-1"
        >
          <ChevronLeftIcon className="w-4 h-4" /> Back
        </span>

      <p className='text-white/90 font-bold text-3xl mt-5'>{editingVariable ? 'Edit' : 'New'} Variable</p>
      <p className='text-white/70 font-medium text-base'>Editing: {branch} branch</p>

    <div className="flex w-full justify-center">
      { loading ? <LoadingIndicator/> : <div className="w-full max-w-4xl p-6 bg-white/40 rounded-lg shadow-md mt-6">

        <label className="block mb-1 font-medium">Variable Name</label>
        <input
          type="text"
          className="w-full mb-4 px-4 py-2 rounded-xl border"
          readOnly={!!editingVariable}
          value={variableName}
          onChange={(e) => setVariableName(e.target.value)}
          placeholder="e.g., DETOX_GRADE"
        />

        <label className="block mb-1 font-medium">Return Type</label>
        <div className="flex gap-3 mb-4">
          {["Value", "Number"].map((type, idx) => (
            <button
              key={type}
              onClick={() => {
                if (idx === 1 && hasNonNumericOutcomes()) {
                    const confirmDelete = confirm("Switching to 'Number' will delete all non-numeric outcome names. Continue?");
                    if (!confirmDelete) return;

                    const filtered = Object.fromEntries(
                    Object.entries(outcomes).filter(([key]) => !isNaN(Number(key)))
                    );
                    setOutcomes(filtered);
                    if (!(activeOutcome in filtered)) setActiveOutcome(Object.keys(filtered)[0] || null);
                }
                setReturnType(idx);
            }}
              className={`px-4 py-1 rounded-full font-medium ${
                returnType === idx
                  ? "bg-purple-800/60 text-white"
                  : "bg-purple-200/60 text-black"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <label className="block mb-1 font-medium">Outcomes</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.keys(outcomes).map((opt) => (
            <button
              key={opt}
              onClick={() => setActiveOutcome(opt)}
              className={`px-4 py-1 rounded-full font-medium ${
                activeOutcome === opt
                  ? outcomes[opt] === 'default' ? "bg-teal-600/80 text-white" : "bg-blue-600/80 text-white"
                  : outcomes[opt] === 'default' ? "bg-teal-200/80 text-black" : "bg-blue-200/80 text-black"
              }`}
            >
              {opt}
            </button>
          ))}
          <button
                onClick={handleAddOutcome}
                className="w-8 h-8 flex items-center justify-center text-lg rounded-full bg-blue-300 text-white hover:bg-blue-400"
            >
                <PlusIcon/>
            </button>

            { activeOutcome &&
            <button
            onClick={handleDeleteOutcome}
            className="w-8 h-8 flex items-center justify-center text-lg rounded-full bg-red-800/40 text-white hover:bg-red-900/60"
            >
            <MinusIcon className="w-4 h-4"/>
            </button>
        }
        </div>

        

        <div className="flex flex-col items-center">
        {
            outcomes[activeOutcome] && outcomes[activeOutcome] === 'default' ? <p className="px-2 py-1 bg-red-700/30 self-start text-white text-sm rounded-full">Remove Default</p> :  outcomes[activeOutcome] && outcomes[activeOutcome].map((block, i) => (
            <div key={i} className="w-full">
            <div className="bg-white/40 relative w-full p-4 rounded my-2 space-y-2 shadow flex gap-6 flex-wrap">
            { block.type === 'comparitor' ?
                <div className="flex gap-2">
                {block['vals'].map((value, j) => (
                    <div key={j} className="flex flex-row gap-2">
                        <p className="font-medium bg-gray-400/30 px-1 rounded-sm flex gap-2 items-center">{value} <div onClick={() => handleDeleteGene(i, value)}><MinusCircleIcon className="w-4 h-4 text-red-800"/></div></p>
                        { j < block['vals'].length - 1 && <p>+</p>}
                    </div>
                ))}
                </div>
                : Object.keys(block['conditions']).map((value, j) => (
                    <div key={j} className="flex flex-col">
                        <div className="flex gap-2 items-center">
                            <p className="font-medium">{value}</p>
                            <div onClick={() => handleDeleteGene(i, value)}><MinusCircleIcon className="w-4 h-4 text-red-800"/></div>
                        </div>
                        <div className="flex flex-row gap-1">
                        { (value in genes ? typeToList(genes[value]) : Object.keys(results[branch][value]['outcomes'])).map((type, k) => (
                            <span 
                                key={k} 
                                className={`px-2 py-0.5 text-sm rounded-full bg-green-200 cursor-pointer ${block['conditions'][value].includes(type) && 'bg-green-600'}`}
                                onClick={() => {
                                    const current = [...outcomes[activeOutcome]];
                                    if (current[i]['conditions'][value].includes(type)) current[i]['conditions'][value] = current[i]['conditions'][value].filter(t => t !== type);
                                    else current[i]['conditions'][value] = [...current[i]['conditions'][value], type];
                                    updateLogic(activeOutcome, current);
                                }}
                            >
                                {type}
                            </span>
                        ))}
                        </div>
                    </div>
                ))
            }

            {(addingGeneIndex === i || (block.type === 'conditional' && Object.keys(block['conditions']).length === 0) || (block.type === 'comparitor' && block['vals'].length === 0)) ? <GeneAdder idx={i} sum={block.type === 'comparitor'}/>
             : <button
                onClick={() => handleAddGene(i)}
                className="text-purple-900 text-sm mt-2"
            >
                <PlusCircleIcon/>
            </button>}

            { block.type === 'comparitor' &&
            <>
                <select
                    value={block.comparitor}
                    onChange={(e) => {
                    const current = [...outcomes[activeOutcome]];
                    current[i].comparitor = e.target.value;
                    updateLogic(activeOutcome, current);
                    }}
                    className="px-2 py-1 border rounded text-sm"
                >
                    <option value=">">{'>'}</option>
                    <option value="<">{'<'}</option>
                    <option value="=">{'='}</option>
                    <option value=">=">{'>='}</option>
                    <option value="<=">{'<='}</option>
                    <option value="!=">{'!='}</option>
                </select>
                <input
                    type="number"
                    value={block.check}
                    onChange={(e) => {
                    const current = [...outcomes[activeOutcome]];
                    current[i].check = Number(e.target.value);
                    updateLogic(activeOutcome, current);
                    }}
                    placeholder="Value"
                    className="px-2 py-1 border rounded w-24 text-sm"
                />
            </>
            }

            <button
                onClick={() => handleDeleteBlock(i)}
                className="text-red-800/75 absolute top-2 right-2"
            >
            <MinusCircleIcon className="w-4 h-4"/>
            </button>

            </div>

            {outcomes[activeOutcome] && i < outcomes[activeOutcome].length - 1 && <p>--- OR ---</p>}
            </div>
        ))}
        
        </div>

        { activeOutcome !== null && outcomes[activeOutcome] !== 'default' &&
        <div className="flex gap-3">
            <button
          onClick={handleAddConditionalBlock}
          className="text-sm text-purple-200 bg-purple-950/50 px-2 py-1 rounded-full hover:underline mt-2 flex items-center gap-2"
        >
          <PlusCircleIcon/> Conditional Block
        </button>

        <button
          onClick={handleAddSumBlock}
          className="text-sm text-purple-200 bg-purple-950/50 px-2 py-1 rounded-full hover:underline mt-2 flex items-center gap-2"
        >
          <PlusCircleIcon/> Sum Block
        </button>

        <button
          onClick={handleMakeDefault}
          className="text-sm text-yellow-200 bg-yellow-950/50 px-2 py-1 rounded-full hover:underline mt-2 flex items-center gap-2"
        >
          <PlusCircleIcon/> Set as Default
        </button>
        </div>
        }

        <button
          onClick={handleSave}
          className="mt-6 bg-lime-600 hover:bg-lime-700 px-4 py-2 rounded text-white font-semibold float-right"
        >
          Save
        </button>

        <button
          onClick={() => router.back()}
          className="mt-6 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white font-semibold float-right mr-3"
        >
          Cancel
        </button>
        </div>
        }
    </div>
    </div>
  );
}
