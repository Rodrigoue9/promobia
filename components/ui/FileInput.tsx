import React, { useState, useEffect } from 'react';
import { UploadCloud, X } from 'lucide-react';

interface FileInputProps {
  label: string;
  id: string;
  // Nova propriedade: onFileSelect agora passa o File object (ou null)
  onFileSelect: (file: File | null) => void;
  // initialValue agora é para o URL PERMANENTE da imagem, não para um File object
  initialValue?: string;
}

const FileInput: React.FC<FileInputProps> = ({ label, id, onFileSelect, initialValue = '' }) => {
  const [preview, setPreview] = useState<string>(initialValue);
  const [fileName, setFileName] = useState<string>('');

  useEffect(() => {
    // Atualiza a pré-visualização se o initialValue mudar (útil para edição)
    setPreview(initialValue);
    if (initialValue) {
        // Tenta extrair o nome do arquivo da URL se for um caminho local simples
        const parts = initialValue.split('/');
        setFileName(parts[parts.length - 1]);
    } else {
        setFileName('');
    }
  }, [initialValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file); // Cria a URL temporária para pré-visualização
      setPreview(fileUrl);
      setFileName(file.name);
      onFileSelect(file); // Passa o ARQUIVO real para o componente pai
    } else {
      setPreview('');
      setFileName('');
      onFileSelect(null); // Nenhum arquivo selecionado
    }
  };
  
  const clearFile = () => {
    setPreview('');
    setFileName('');
    onFileSelect(null); // Sinaliza que nenhum arquivo está selecionado
    // Reset file input value para que o onChange seja disparado mesmo se o mesmo arquivo for selecionado novamente
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          {preview ? (
            <div className="relative group w-48 mx-auto">
              <img src={preview} alt="Preview" className="mx-auto h-24 w-auto rounded-md" />
              <button 
                type="button" 
                onClick={clearFile}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remover imagem"
              >
                <X size={16} />
              </button>
              <p className="text-xs text-slate-400 truncate w-48">{fileName || 'Imagem atual'}</p>
            </div>
          ) : (
            <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
          )}
          <div className="flex text-sm text-slate-400">
            <label
              htmlFor={id}
              className="relative cursor-pointer bg-slate-800 rounded-md font-medium text-primary-400 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
            >
              <span>{preview ? 'Trocar arquivo' : 'Carregar um arquivo'}</span>
              <input id={id} name={id} type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
            </label>
            <p className="pl-1">ou arraste e solte</p>
          </div>
          <p className="text-xs text-slate-400">PNG, JPG, GIF até 10MB</p>
        </div>
      </div>
    </div>
  );
};

export default FileInput;