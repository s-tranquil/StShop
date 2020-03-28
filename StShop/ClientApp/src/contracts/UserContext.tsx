import * as React from "react";

import { Address } from "../models/address";
import { UserProfile } from "../models/user-profile";

interface IUserContext {
    user?: UserProfile;
    setUser: (user: UserProfile) => void;
    resetUser: () => void;
}

const UserContext = React.createContext<IUserContext>({} as IUserContext);

const expirationMinutes = 5;
const localStorageUserKey = "StShop:User:UserProfile";
const defaultValue: UserProfile = {
    email: "",
    name: "",
    surname: "",
    displayAddress: "",
    address: {} as Address
};

interface IStorageUserItem {
    data: UserProfile,
    updatedAt: string | Date;
}

const UserProvider: React.FC = ({ children }) => {
    const [user, setUserState] = React.useState<UserProfile>();

    const setUser = React.useCallback(
        (user: UserProfile) => {
            function setUserLocalStorage(value: UserProfile) {
                const valueItem = {
                    data: value,
                    updatedAt: new Date()
                } as IStorageUserItem;

                const valueString = JSON.stringify(valueItem);

                localStorage.setItem(localStorageUserKey, valueString);
            }

            setUserLocalStorage(user);
            setUserState(user);
        },
        [setUserState]
    );

    const resetUser = React.useCallback(
        () => setUser(defaultValue),
        [setUser]
    );

    React.useEffect(
        () => { 
            async function fetchUserProfile() {
                const response = await fetch("account/getprofile");

                if (!response.ok) {
                    setUser(defaultValue);
                    return;
                }

                const model: UserProfile = await response.json();
                if (model && model.email) {
                    setUser(model)
                } else {
                    setUser(defaultValue);
                }
            }

            // just for the sake of using local storage
            const storageItemString = localStorage.getItem(localStorageUserKey);
            if (!storageItemString) {
                fetchUserProfile();
            }
            const storageItem: IStorageUserItem = JSON.parse(storageItemString as string);
            if (
                (
                    new Date().getTime() - 
                    new Date(storageItem.updatedAt as string).getTime()
                )
                / (60 * 1000)
                < expirationMinutes
            ) {
                setUser(storageItem.data);
            } else {
                fetchUserProfile();
            }
        },
        [setUser]
    );

    return (
        <UserContext.Provider
            value= {{
                user,
                setUser,
                resetUser
            }}
          >
            {children}
        </UserContext.Provider>
    );
}

export { UserContext, UserProvider };
 