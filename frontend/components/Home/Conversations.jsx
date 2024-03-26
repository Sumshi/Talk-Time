"use client";

import React, { useState, useEffect } from "react";
import Searchinput from "./Search";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useDispatch, useSelector } from "react-redux";
import {
	setMsg,
	removeMsg,
} from "@/lib/Features/Conversations/conversationSlice";
import { setUserData } from "@/lib/Features/UsersData/userDataSlice";
import { setInterlocuteur } from "@/lib/Features/Interlocuteur/interlocuteurSlice";
import { useSocketContext } from "../../context/SocketContext";
import useListenMessages from "@/hooks/useListenMessages";

export default function Conversations(props) {
	const [conversations, setConversations] = useState([]);
	//const token = useSelector((state) => state.auth.value);
	const token = localStorage.getItem("chat-user");
	const isMobile = props.heightRef
	const setGoBack = props.gob
	const setMsgUp = props.msgsUp;

	const [userId, setUserId] = useState(null);
	// const [messages, setMessages] = useState([]);
	const { onlineUsers } = useSocketContext();

	const dispatch = useDispatch();
	useListenMessages();

	useEffect(() => {
		const getConversations = async () => {
			try {
				const res = await fetch("http://localhost:8080/api/users", {
					method: "GET",
					credentials: "include",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				});
				const data = await res.json();
				if (data.error) {
					throw new Error(data.error);
				}
				setConversations(data);
				dispatch(setUserData(data));
			} catch (error) {
				console.log(error);
			}
		};

		getConversations();
	}, []);

	useEffect(() => {
		const getMessages = async () => {
			if (userId === null) {
				dispatch(removeMsg());
				return;
			}
			try {
				const res = await fetch(
					`http://localhost:8080/api/messages/${userId}`,
					{
						method: "GET",
						credentials: "include",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					}
				);
				const data = await res.json();
				if (data.error) {
					throw new Error(data.error);
				}
				dispatch(setMsg(data));
			} catch (error) {
				console.log(error);
			}
		};
		getMessages();
	}, [userId]);

	return (
		<div className={`flex flex-col h-screen relative ${isMobile ? 'w-screen' : 'w-96'} border`}>
			<div className={`mx-4 ${isMobile ? 'h-[93%]' : 'h-[100%]'} relative`}>
				<div className="h-[33%] flex flex-col justify-between">
					<h2 className="text-xl font-semibold my-4 ">Chats</h2>
					<div className="flex bg-[#E6EBF5] items-center h-10 rounded  ">
						<Searchinput />
					</div>
					<h3 className="text-md">Recent</h3>
					<div className="flex justify-around bg-white z-50 my-4">
						{conversations.slice(0, 4).map((item) => (
							<Avatar key={item._id} className="cursor-pointer">
								<AvatarImage src={item.profilePic} alt="@shadcn" />
								<AvatarFallback>{item.username.slice(0, 1)}</AvatarFallback>
							</Avatar>
						))}
					</div>
					<h3 className="text-md z-50 bg-white">Conversations</h3>
				</div>
				<div className="h-[67%]">
					<div className="overflow-auto scrollbar-thumb-slate-700 scrollbar-track-slate-300 scrollbar-thin max-h-full">
						{conversations.map((item) => (
							<div
								key={item._id}
								className={`flex cursor-pointer relative px-2 w-full rounded h-20 items-center ease-in duration-150 hover:bg-[#E6EBF5] ${
									userId === item._id ? "bg-[#E6EBF5]" : ""
								}`}
								onClick={() => {
									setUserId(item._id);
									setGoBack(true);
									setMsgUp(false);
									dispatch(setInterlocuteur(item));
								}}
							>
								<div className="mr-2 relative">
									<div
										className={
											onlineUsers.includes(item._id)
												? " h-3 w-3 border rounded-full bg-green-500 absolute z-50"
												: ""
										}
									></div>
									<Avatar className="h-8 w-8">
										<AvatarImage
											src={item.profilePic}
											alt={item.username.slice(0, 1)}
										/>
										<AvatarFallback>{item.username.slice(0, 1)}</AvatarFallback>
									</Avatar>
								</div>
								<div>
									<h4 className="text-sm">{item.username}</h4>
									<p className="text-gray-500 text-xs">
										hey! there I'm available
									</p>
								</div>
								<div className="absolute text-gray-500 text-xs right-2">
									<p>02:50 PM</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
