import * as React from "react";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";
import { Progress } from "@/components/ui/progress";

type LeaseDocument = Database['public']['Tables']['lease_documents']['Row'];

interface DocumentsTabProps {
  form: UseFormReturn<any>;
  leaseId?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export function DocumentsTab({ form, leaseId }: DocumentsTabProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [documents, setDocuments] = React.useState<LeaseDocument[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (leaseId) {
      fetchDocuments();
    }
  }, [leaseId]);

  const fetchDocuments = async () => {
    if (!leaseId) return;
    
    const { data, error } = await supabase
      .from('lease_documents')
      .select('*')
      .eq('lease_id', leaseId);
      
    if (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      });
      return;
    }
    
    setDocuments(data || []);
  };

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "Invalid file type. Please upload PDF or Word documents only.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size exceeds 10MB limit.";
    }
    return null;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!leaseId || !event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    const validationError = validateFile(file);
    
    if (validationError) {
      toast({
        title: "Error",
        description: validationError,
        variant: "destructive",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${leaseId}/${fileName}`;

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const { error: uploadError } = await supabase.storage
        .from('lease-documents')
        .upload(filePath, file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('lease_documents')
        .insert({
          lease_id: leaseId,
          name: file.name,
          file_path: filePath,
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      fetchDocuments();
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (documentId: string, filePath: string) => {
    try {
      const { error: storageError } = await supabase.storage
        .from('lease-documents')
        .remove([filePath]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('lease_documents')
        .delete()
        .eq('id', documentId);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });

      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <Input
          type="file"
          onChange={handleFileUpload}
          disabled={uploading || !leaseId}
          accept=".pdf,.doc,.docx"
          ref={fileInputRef}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
        />
        
        {uploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="w-full" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Uploading...</span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {documents.map((doc) => (
          <div 
            key={doc.id} 
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{doc.name}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(doc.id, doc.file_path)}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        {documents.length === 0 && !uploading && (
          <div className="text-center p-4 border border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground">
              No documents uploaded yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}