import { Types } from "mongoose";
import { NextResponse } from "next/server";
import connect from "../../../../../../lib/db";
import User from "../../../../../../lib/modals/user";
import Note from "../../../../../../lib/modals/notes";

//to get the Note object Based on the NoteId
export const GET = async (request: Request, context: { params: any }) => {

    try {
        const noteId = context.params.note;
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        //verify userId is not empty and valid
        if (!noteId || !Types.ObjectId.isValid(noteId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or Missing NoteId" }), { status: 400 });
        }
        //verify noteId is not empty and valid
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or Missing UserId" }), { status: 400 });
        }

        await connect();
        //featching the User from database by userId
        const user = await User.findById(userId);
        //Confirming the existence of the user.
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        const note = await Note.findOne({ _id: noteId, user: userId });
        //Confirming the existence of the note.
        if (!note) {
            return new NextResponse(JSON.stringify({ message: "Note not found" }), { status: 404 });
        }
        return new NextResponse(JSON.stringify({ message: "Found", note }), { status: 200 });

    } catch (error) {
        return new NextResponse(JSON.stringify({ message: "Error will featching the Note by id", error }), { status: 500 });
    }
};