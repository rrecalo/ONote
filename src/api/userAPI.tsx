import axios from "axios";
import {Note} from '../types/Note';
import { Folder } from "../types/Folder";

const BASE_URL = "http://localhost:3001";
//http://localhost:3001/getUserNotes

export async function getUserPrefs(email : string | undefined){
    let endpoint = "/getUserPrefs";
    return axios.get(BASE_URL + endpoint, {params: {email : email}}).then((response) =>{return(response)});
}

export async function getUserNotes(email : string | undefined){
    
    let endpoint = "/getUserNotes";
    return axios.get(BASE_URL + endpoint, {params: {email : email}}).then((response) =>{return(response)});
}

export async function getUserFolders(email : string | undefined){
    
    let endpoint = "/getUserFolders";
    return axios.get(BASE_URL + endpoint, {params: {email : email}}).then((response) =>{return(response)});
}

export async function createNote(email : string | undefined, title : string, text : string | undefined){

    let endpoint = "/createNote";
    return axios.post(BASE_URL + endpoint, {email : email, title : title, text: text}).then((response) =>{return(response)});
}

export async function createFolder(email: string | undefined, folderName : string){
    let endpoint = "/createFolder";
    return axios.put(BASE_URL + endpoint, {email : email, name: folderName}).then((response) =>{return(response)});
}

export async function updateUserPrefs(email : string | undefined, prefs : any){
    let endpoint = "/updateUserPrefs";
    return axios.put(BASE_URL + endpoint, {email : email, prefs: prefs}).then((response) => {return(response)});
}

export async function updateNote(note : Note){
    let endpoint = "/updateNote";
    return axios.put(BASE_URL + endpoint, {title : note.title, _id: note._id, folder: note.folder, text: note.text, index: note.index}).then((response) => {return(response)});
}

export async function saveFolderName(email : string | undefined, folder : Folder){
    let endpoint = "/updateFolderName";
    return axios.put(BASE_URL + endpoint, {email : email, _id : folder._id, name : folder.name}).then((response) => {return(response)});
}

export async function saveFolderState(email : string | undefined, folder : Folder){
    let endpoint = "/updateFolderState";
    return axios.put(BASE_URL + endpoint, {email : email, _id : folder._id, opened : folder.opened}).then((response) => {return(response)});
}

export async function updateUserFolders(email : string | undefined, folders : Folder[]){
    let endpoint = "/updateUserFolders";
    return axios.put(BASE_URL + endpoint, {email : email, folders: folders}).then((response) => {return(response)});
}

export async function deleteNote(note : Note, email: string | undefined){
    let endpoint = "/deleteNote";
    return axios.delete(BASE_URL + endpoint, {params:{_id: note._id, email : email}}).then((response) => {return(response)});
}

export async function deleteFolder(email: string | undefined, folder : Folder){
    console.log(email, folder);
    let endpoint = "/deleteFolder";
    return axios.delete(BASE_URL + endpoint, {params:{email : email, _id: folder?._id, }}).then((response) => {return(response)});
}