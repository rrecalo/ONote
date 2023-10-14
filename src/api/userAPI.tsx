import axios from "axios";
import {Note} from '../types/Note';
import { Folder } from "../types/Folder";

const BASE_URL = "http://localhost:3001";
//http://localhost:3001/getUserNotes

export async function getUserNotes(email : string | undefined){
    
    let endpoint = "/getUserNotes";
    return axios.get(BASE_URL + endpoint, {params: {email : email}}).then((response) =>{return(response)});
}

export async function getUserFolders(email : string | undefined){
    
    let endpoint = "/getUserFolders";
    return axios.get(BASE_URL + endpoint, {params: {email : email}}).then((response) =>{return(response)});
}

export async function createNote(email : string | undefined, text : string | undefined){

    let endpoint = "/createNote";
    return axios.post(BASE_URL + endpoint, {email : email, text: text}).then((response) =>{return(response)});

}

export async function updateNote(note : Note){
    let endpoint = "/updateNote";
    return axios.put(BASE_URL + endpoint, {title : note.title, _id: note._id, folder: note.folder, text: note.text}).then((response) => {return(response)});
}

export async function updateFolder(email : string | undefined, folder : Folder){
    let endpoint = "/updateFolderName";
    return axios.put(BASE_URL + endpoint, {email : email, _id : folder._id, name : folder.name}).then((response) => {return(response)});
}

export async function deleteNote(note : Note, email: string | undefined){
    let endpoint = "/deleteNote";
    return axios.delete(BASE_URL + endpoint, {params:{_id: note._id, email : email}}).then((response) => {return(response)});
}