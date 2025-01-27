import { AppLayout } from "@/components/layout/AppLayout";
import { ContactList } from "@/components/contacts/ContactList";

const Contacts = () => {
  return (
    <AppLayout 
      title="Contacts" 
      description="Manage your contacts and their relationships with properties and leases"
    >
      <ContactList />
    </AppLayout>
  );
};

export default Contacts;