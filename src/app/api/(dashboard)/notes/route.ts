import { NextResponse } from "next/server";
import connect from "../../../../../lib/db";
import User from "../../../../../lib/modals/user";
import Note from "../../../../../lib/modals/notes";
import { request } from "http";
import { Types } from "mongoose";
// to fetch the notes from the database based on the userId
export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        //validating userId is not null and valid id is given
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid Or missing userId" }), { status: 404 });
        }

        await connect();
        const user = await User.findById(userId);
        //Validting user exists in the database or not
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User Not Found" }), { status: 404 });
        }
        //featching the notes based on the userId
        const notes = await Note.find({ user: new Types.ObjectId(userId) });
        return new NextResponse(JSON.stringify(notes), { status: 200 });

    } catch (error) {
        console.log(error);
        return new NextResponse("Error in featching the Notes" + error, { status: 500 });
    }
}
//To Save the Notes based on the UserId
export const POST = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        //validating userId is not null and valid id is given
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid Or Missing UserId " }), { status: 400 });
        }
        await connect();
        //featching the User By UserId
        const user = await User.findById(userId);
        //validating if user Exsist or not
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User Not Found " }), { status: 404 });
        }
        //geting the note Json from the Request Body
        const body = await request.json();
        const { title, description } = body;
        // creating the Note Object to save in the DataBase
        const newNote = new Note({ title, description, user: new Types.ObjectId(userId) });
        // saving the Note in the DataBase
        const savedNote = await newNote.save();
        //validating note Creation is successful or not
        if (!savedNote) {
            return new NextResponse(JSON.stringify({ message: "Note Note Created" },), { status: 400 });
        }
        return new NextResponse(JSON.stringify({ message: "Created", data: savedNote }), { status: 201 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: "Error in Creating Note", error }), { status: 500 });
    }

};
//to update the note
export const PATCH = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        const body = await request.json();
        const { noteId, title, description } = body;
        //veryfing  the userId is valid or not
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid Or Missing UserId" }), { status: 400 });
        }
        //veryfing the noteId is valid or not
        if (!noteId || !Types.ObjectId.isValid(noteId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid Or Missing NoteId" }), { status: 400 });
        }

        await connect();
        //featching the user
        const user = await User.findById(userId);
        //veryfing the user exsits or not
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User Not Found" }), { status: 404 });
        }
        //featching the note
        const note = await Note.findOne({ _id: noteId, user: userId });

        //veryfing the note exsits or not
        if (!note) {
            return new NextResponse(JSON.stringify({ message: "Note Not Found" }), { status: 404 });
        }
        //updating the note
        const updatedNote = await Note.findByIdAndUpdate(noteId, { title, description }, { new: true });
        //returning the updated note
        return new NextResponse(JSON.stringify({ message: "Note Updated", data: updatedNote }), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: "Error will Updating the Note", error }), { status: 500 });
    }
};
//To delete a note

export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const noteId = searchParams.get('noteId');
        const userId = searchParams.get('userId');
        //veryfing the noteId is valid or not
        if (!noteId || !Types.ObjectId.isValid(noteId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing noteId" }), { status: 400 });
        }
        //veryfing the userId is valid or not
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing userId" }), { status: 400 });
        }
        await connect();
        //featching the user
        const user = await User.findById(userId);
        //veryfing the user exsits or not
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User Not Found" }), { status: 404 });
        }
        //Featching the Note
        const note = await Note.findOne({ _id: noteId, user: userId });
        //veryfing the note
        if (!note) {
            return new NextResponse(JSON.stringify({ message: "Note Not Found or Does not belong to the user" }), { status: 404 });
        }
        await Note.findByIdAndDelete(noteId);
        return new NextResponse(JSON.stringify(undefined), { status: 204 });

    } catch (error) {
        return new NextResponse(JSON.stringify({ message: "Error will Delete the Note", error }), { status: 500 });
    }
};

