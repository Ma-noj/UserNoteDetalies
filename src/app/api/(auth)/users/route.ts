import { NextResponse } from "next/server";
import connect from "../../../../../lib/db";
import User from "../../../../../lib/modals/user";
import { request } from "http";
import { Types } from "mongoose";

const ObjectId = require("mongoose").Types.ObjectId;

//  To get the User Info from the database
export const GET = async () => {
    try {
        await connect();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), { status: 200 });
    } catch (error) {

        return new NextResponse(JSON.stringify({ message: "Error in fetching Users", error }), { status: 500 });

    }
};
// To save the user to the database
export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        await connect();
        const newUser = new User(body);
        await newUser.save();
        return new NextResponse(JSON.stringify({ message: "User Created", user: newUser }), { status: 201 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: "Error in fetching Users", error }), { status: 500 });
    }
};
//to update the userName based on the userId to the database
export const PATCH = async (request: Request) => {
    try {
        const body = await request.json();
        const { userId, newUserName } = body;
        await connect();
        // ensure that both the userId and UserName are not empty
        if (!userId || !newUserName) {
            return new NextResponse(JSON.stringify({ message: "ID or UserName are required" }), {
                status: 400,
            });
        }
        //validating whether the UserId is of type ObjectId.
        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: `Given UserId ${userId} is Invalid` }), {
                status: 400,
            });
        }
        //Verifying the existence of a user object with the provided UserID.
        const updateUser = await User.findOneAndUpdate({ _id: new ObjectId(userId) }, { userName: newUserName }, { new: true });

        //Verifying the user updated or not
        if (!updateUser) {
            return new NextResponse(JSON.stringify({ message: `Given UserId ${userId} is Invalid did't Modified` }), {
                status: 400,
            })
        }

        //Returning the updated user
        return new NextResponse(JSON.stringify({ message: "User Updated", user: updateUser }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ message: "Error in Updateing the Users", error }), { status: 500 });
    }
};

//To Delete a User basided on the userId
export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        //validating the UserId 
        if (!userId) {
            return new NextResponse(JSON.stringify({ message: "userId is required" }), {
                status: 400,
            });
        }
        //validating the userId id a valid or invalid 
        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: `Given UserId ${userId} is Invalid` }), {
                status: 400,
            });
        }

        await connect();
        //deleteing the user from the database by userId
        const deleteUser = await User.findByIdAndDelete({ _id: new ObjectId(userId) });
        //validating if user found and deleted
        if (!deleteUser) {
            return new NextResponse(JSON.stringify({ message: `Given UserId ${userId} is Invalid did't Deleted` }), {
                status: 400,
            });
        }
        //Return a success response
        return new NextResponse(undefined, { status: 204 });
        //Not able to set the status code as 204 due to some server error
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ message: "Error in Delete Users", error }), { status: 500 });
    }
};





