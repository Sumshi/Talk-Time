"use client";

import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HiDotsVertical } from "react-icons/hi";

export default function Contacts() {
	const [conversations, setConversations] = useState([]);
	const token = localStorage.getItem("chat-user");

	useEffect(() => {
		const getConversations = async () => {
			try {
				const res = await fetch("http://localhost:8080/api/users", {
					method: "GET",
					credentials: "include",
					headers: {
						Authorization: `Bearer ${token}`, // Include the token in the Authorization header
						"Content-Type": "application/json",
					},
				});
				const data = await res.json();
				if (data.error) {
					throw new Error(data.error);
				}
				console.log(data);
				setConversations(data);
			} catch (error) {
				console.log(error);
			}
		};

		getConversations();
	}, []);

	return (
		<div className="flex flex-col relative w-full border">
			<div className="mx-4 ">
				<h2 className="text-xl font-semibold my-4">Contacts</h2>
				<div className="flex bg-[#E6EBF5] items-center h-10 rounded  ">
					<div className="p-4 text-xl text-gray-500 ">
						<CiSearch />
					</div>
					<input
						className="focus:outline-none bg-[#E6EBF5] text-gray-500 text-sm "
						type="text"
						placeholder="Search messages or users"
					/>
				</div>
				<div className="">
					{conversations.map((item) => (
						<div
							key={item._id}
							className="flex cursor-pointer relative p-2 w-full rounded h-20 items-center ease-in duration-150 hover:text-[#E6EBF5]"
						>
							<div className="mr-2">
								<Avatar className="h-8 w-8">
									<AvatarImage
										src={item.profilePic}
										alt={item.username.slice(0, 1)}
									/>
									<AvatarFallback>{item.username.slice(0, 1)}</AvatarFallback>
								</Avatar>
							</div>
							<div>
								<h4 className="text-sm">{item.fullName}</h4>
							</div>
							<div className="absolute text-gray-500 text-xs right-2">
								<HiDotsVertical/>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
