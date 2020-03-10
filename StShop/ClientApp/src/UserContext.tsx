import * as React from "react";

interface IUser {
    loggedIn: boolean;
    userName?: string;
}

interface IUserContext {
    user?: IUser;
    setUser: (user: IUser) => void;
}

const UserContext = React.createContext<IUserContext>({} as IUserContext);

const UserProvider: React.FC = ({ children }) => {
    const [user, setUser] = React.useState<IUser>();
    return (
        <UserContext.Provider
            value= {{
                user,
                setUser
            }}
          >
            {children}
        </UserContext.Provider>
    );
}

export { UserContext, UserProvider };
