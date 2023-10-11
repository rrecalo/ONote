import axios from "axios";
import {Note} from '../types/Note';

const BASE_URL = "http://localhost:3001";
//http://localhost:3001/getUserNotes

export async function getUserNotes(email : string | undefined){
    
    let endpoint = "/getUserNotes";
    return axios.get(BASE_URL + endpoint, {params: {email : email}}).then((response) =>{return(response)});
}

export async function createNote(email : string | undefined, text : string | undefined){

    let endpoint = "/createNote";
    return axios.post(BASE_URL + endpoint, {email : email, text: text}).then((response) =>{return(response)});

}

export async function updateNote(note : Note){
    let endpoint = "/updateNote";
    return axios.put(BASE_URL + endpoint, {title : note.title, _id: note._id, text: note.text}).then((response) => {return(response)});
}