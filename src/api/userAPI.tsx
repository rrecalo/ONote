import axios from "axios";
import {Note} from '../types/Note';
import { Folder } from "../types/Folder";

const BASE_URL = "https://api.onote.cloud"


export async function getUser(email : string | undefined ){
    let endpoint = "/get_user_by_email/"+email;
    return axios.get(BASE_URL+endpoint).then((response) =>{return(response)});
    //return axios.get(BASE_URL + endpoint, {params: {email : email}}).then((response) =>{return(response)});

}

export async function getUserNotes(email : string | undefined){
    let endpoint = "/get_notes_by_user/"+email;
    return axios.get(BASE_URL + endpoint).then((response) =>{return(response)});
    //return axios.get(RUST_URL + endpoint, {params: {email : email}}).then((response) =>{return(response)});
}

export async function createNote(email : string | undefined, title : string, text : string | undefined){

    let endpoint = "/create_user_note";
    return axios.post(BASE_URL + endpoint, {email : email, note_title : title}).then((response) =>{return(response)});
    //return axios.post(BASE_URL + endpoint, {email : email, title : title, text: text}).then((response) =>{return(response)});
}

export async function createFolder(email: string | undefined, folderName : string, folderCount: number){
    let endpoint = "/create_user_folder";
    return axios.put(BASE_URL + endpoint, {email : email, folder_name: folderName, folder_index: folderCount}).then((response) =>{return(response)});
}

export async function updateUserPrefs(email : string | undefined, prefs : any){
    let endpoint = "/update_user_prefs";
    return axios.put(BASE_URL + endpoint, {email : email, editorWidth: prefs.editorWidth,  editorPosition: prefs.editorPosition}).then((response) => {return(response)});
}

export async function updateUserLastNote(email : string | undefined, noteId : string){
    let endpoint = "/update_user_last_note";
    return axios.put(BASE_URL + endpoint, {email : email, last_note: noteId}).then((response) => {return(response)});
}

export async function updateNote(note : Note){
    let endpoint = "/update_note";
    return axios.put(BASE_URL + endpoint, {title : note.title, _id: note._id, folder: note.folder, text: note.text, index: note.index}).then((response) => {return(response)});
}

export async function saveFolderState(email : string | undefined, folder : Folder){
    let endpoint = "/update_user_folder";
    return axios.put(BASE_URL + endpoint, {email : email, folder_id : folder._id, name: folder.name, order:folder.order, opened : folder.opened}).then((response) => {return(response)});
}

export async function updateUserFolders(email : string | undefined, folders : Folder[]){
    let endpoint = "/update_all_user_folders";
    return axios.put(BASE_URL + endpoint, {email : email, folders: folders}).then((response) => {return(response)});
}

export async function deleteNote(note : Note, email: string | undefined){
    let endpoint = "/delete_user_note";
    return axios.delete(BASE_URL + endpoint, {params:{_id: note._id, email : email}}).then((response) => {return(response)});
}

export async function deleteFolder(email: string | undefined, folder : Folder){
    let endpoint = "/delete_user_folder";
    return axios.put(BASE_URL + endpoint, {email : email, _id: folder?._id, }).then((response) => {return(response)});
}
