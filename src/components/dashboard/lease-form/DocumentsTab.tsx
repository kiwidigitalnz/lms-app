import * as React from "react";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DocumentsTabProps {
  form: UseFormReturn<any>;
  leaseId?: string;
}

export function DocumentsTab({ form, leaseId }: DocumentsTabProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = React.useState(false);
  const [documents, setDocuments] = React.useState<any[]>([]);

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
      return;
    }
    
    setDocuments(data || []);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!leaseId || !event.target.files || event.target.files.length === 0) return;
    
    try {
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${leaseId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('lease-documents')
        .upload(filePath, file);

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
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
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
      <div className="flex items-center gap-4">
        <Input
          type="file"
          onChange={handleFileUpload}
          disabled={uploading || !leaseId}
          accept=".pdf,.doc,.docx"
        />
        {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
      </div>

      <div className="space-y-2">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
            <span className="text-sm">{doc.name}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(doc.id, doc.file_path)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}