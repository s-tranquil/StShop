import * as React from "react";

import { useForm } from "react-hook-form";
import {
    Map,
    Marker,
    Popup,
    TileLayer,
    withLeaflet
} from "react-leaflet";
import { ReactLeafletSearch } from "react-leaflet-search";
import {
    Link,
    useHistory
} from "react-router-dom";
import { nameof } from "ts-simple-nameof";

import { emailRegexp } from "../../constants";
import { UserContext } from "../../contracts";

import { Address } from "../../models/address";
import { RegisterModel } from "../../models/register-model";
import { User } from "../../models/user";

interface IRegisterAddressState {
    displayAddress: string;
    address: Address;
}

const fieldNames = {
    email: nameof<RegisterModel>(x => x.email),
    name: nameof<RegisterModel>(x => x.name),
    surname: nameof<RegisterModel>(x => x.surname),
    password: nameof<RegisterModel>(x => x.password),
    address: nameof<RegisterModel>(x => x.address),
    displayAddress: nameof<RegisterModel>(x => x.displayAddress)
};

const RegisterPage: React.FC<any> = () => {
    const history = useHistory();
    const { setUser } = React.useContext(UserContext);
    const { register, handleSubmit, errors } = useForm();
    const [addressState, setAddressState] = React.useState<IRegisterAddressState>({
        displayAddress: "",
        address: {} as Address
    });

    const onSubmit = React.useCallback(
        (submitData) => {
            submitData.address = addressState.address;
            fetch(
                "account/register",
                {
                    method: "POST",
                    cache: "no-cache",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(submitData)
                })
                .then(response => {
                    console.log(response);
                    response
                        .json()
                        .then((user: User) => {
                            setUser({
                                loggedIn: true,
                                userName: user.email
                            });
                            history.push('/users')
                        });
                })
                .catch();// TODO: add 403 handling

        },
        [setUser, history, addressState]
    );

    const SearchComponent = React.useMemo(
        () => {
            // good old monkey-patching
            // I wish it was another way...
            const originalLatLngHandler = ReactLeafletSearch.prototype.latLngHandler;
            ReactLeafletSearch.prototype.latLngHandler = function (...props: Parameters<ReactLeafletSearch["latLngHandler"]>) {
                // getting our address from raw osm response array
                const latLng = props[0];
                const rawInfos = (props[2] as any).raw as any[];
                const rawInfo = rawInfos
                    .find(x => 
                        x.lat == latLng.lat && 
                        x.lon == latLng.lng
                    );
                const rawAddress = rawInfo.address;

                // making sure that it's a house
                if ("house_number" in rawAddress) {
                    setAddressState({
                        displayAddress: rawInfo.display_name,
                        address: {
                            country: rawAddress.country,
                            city: rawAddress.city,
                            street: rawAddress.road,
                            house: rawAddress.house_number,
                            zipCode: rawAddress.postcode
                        }
                    });
                }
                // calling the original handler
                originalLatLngHandler.apply(this, props);
            }

            return withLeaflet(ReactLeafletSearch);
        },
        [setAddressState, ReactLeafletSearch]
    );

    return (
        <div>
            <h1>Register Page</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor={fieldNames.email}>Email</label>
                    <input
                        name={fieldNames.email}
                        ref={register({ required: true, pattern: emailRegexp })} 
                    />
                    {errors[fieldNames.email] && <span>Enter a valid email</span>}
                </div>

                <div>
                    <label htmlFor={fieldNames.name}>Name</label>
                    <input
                        name={fieldNames.name}
                        ref={register({ required: true })} 
                    />
                    {errors[fieldNames.name] && <span>Enter your name</span>}
                </div>

                <div>
                    <label htmlFor={fieldNames.surname}>Surname</label>
                    <input
                        name={fieldNames.surname}
                        ref={register({ required: true })} 
                    />
                    {errors[fieldNames.surname] && <span>Enter your surname</span>}
                </div>

                <div>
                    <label htmlFor={fieldNames.displayAddress}>Address</label>
                    <input
                        name={fieldNames.displayAddress}
                        ref={register({ required: true })}
                        readOnly={true}
                        value={addressState.displayAddress}
                    />
                    {errors[fieldNames.displayAddress] && <span>Input your address into the text field on the map</span>}
                </div>

                <div>
                    <label htmlFor={fieldNames.password}>Choose a password</label>
                    <input
                        name={fieldNames.password}
                        type="password"
                        ref={register({ required: true })} 
                    />
                    {errors[fieldNames.password] && <span>Enter a password</span>}
                </div>

                <input type="submit" />
            </form>

            <div>
                <Map
                    center={[50, 10]}
                    zoom={6}
                    maxZoom={16}
                    attributionControl={true}
                    zoomControl={true}
                    doubleClickZoom={true}
                    scrollWheelZoom={true}
                    dragging={true}
                    animate={true}
                    easeLinearity={0.35}
                >
                    <TileLayer
                        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    />
                    <SearchComponent
                        position='topleft'
                        zoom={16}
                        showMarker={true}
                        showPopup={true}
                        closeResultsOnClick={true}
                        openSearchOnLoad={true}
                    />
                    <Marker position={[50, 10]}>
                    <Popup>
                        Popup for any custom information.
                    </Popup>
                    </Marker>
                </Map>
            </div>
        </div>
    )
};

export { RegisterPage };