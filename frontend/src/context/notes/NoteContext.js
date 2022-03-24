import { createContext } from "react";

// when we have a lot of components and we want to send a property from App.js to component of component then we can send it
// through props but it will make it complex and so to avoid it we use Context that make us reach any component without going to its parents

const NoteContext = createContext();


export default NoteContext;

