import { Contact } from "@/types/contact";

export const getContactLabel = (contact: Contact): string => {
  const name = `${contact.first_name} ${contact.last_name || ""}`.trim();
  return contact.company ? `${name} (${contact.company})` : name;
};

export const filterContacts = (contacts: Contact[], search: string): Contact[] => {
  if (!search) return contacts;
  const searchTerm = search.toLowerCase();
  return contacts.filter(contact => {
    const firstName = contact.first_name.toLowerCase();
    const lastName = (contact.last_name || "").toLowerCase();
    const company = (contact.company || "").toLowerCase();
    
    return firstName.includes(searchTerm) || 
           lastName.includes(searchTerm) || 
           company.includes(searchTerm);
  });
};