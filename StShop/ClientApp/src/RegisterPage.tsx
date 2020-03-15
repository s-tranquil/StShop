import * as React from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "./UserContext";
import { useForm } from "react-hook-form";
import { User } from "./models/user";
import { emailRegexp } from "./constants";
import { RegisterModel } from "./models/register-model";
import { nameof } from "ts-simple-nameof";
import { Map, TileLayer, Marker, Popup, withLeaflet } from "react-leaflet";
import { ReactLeafletSearch } from "react-leaflet-search";
import { OpenStreetMap as OpenStreetMapProvider  } from "react-leaflet-search/lib/Providers";
import { SearchControlProps  } from "react-leaflet-search/lib/search-control";

const fieldNames = {
    email: nameof<RegisterModel>(x => x.email),
    name: nameof<RegisterModel>(x => x.name),
    surname: nameof<RegisterModel>(x => x.surname),
    password: nameof<RegisterModel>(x => x.password),
    address: nameof<RegisterModel>(x => x.address)
};

// good old monkey-patching
// I wish it was another way...
const oldLatLngHandler = ReactLeafletSearch.prototype.latLngHandler;
ReactLeafletSearch.prototype.latLngHandler = function (...props: Parameters<ReactLeafletSearch["latLngHandler"]>) {
    console.log(...props);
    oldLatLngHandler.apply(this, props);
}

const SearchComponent = withLeaflet(ReactLeafletSearch);

// const searchComponentDecorated = new Proxy(
//     searchComponent,
//     {
//         get: function (obj, prop) {
//             if (prop === "search") {
//                 return (...props: Parameters<ReactLeafletSearch["latLngHandler"]>) => {
//                     var result =  searchComponent.latLngHandler(...props);
//                     return result;
//                 }
//             }
//         }
//     }
// );
// const osmProvider = new OpenStreetMapProvider({
//     providerKey: "CustomOsmProvider"
// });
// const osmProviderDecorated = new Proxy(
//     osmProvider,
//     {
//         get: function (obj, prop) {
//             if (prop === "search") {
//                 return (...props: Parameters<OpenStreetMapProvider["search"]>) => {
//                     var result =  osmProvider.search(...props);
//                     return result;
//                 }
//             }
//         }
//     }
// );

const RegisterPage: React.FC<any> = () => {
    const history = useHistory();
    const { setUser } = React.useContext(UserContext);
    const { register, handleSubmit, errors } = useForm();

    const onSubmit = React.useCallback(
        (submitData) => {
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
                            history.push('/app')
                        });
                })
                .catch();// TODO: add 401 handling

        },
        [setUser, history]
    );

    return (
        <div>
            <h1>Register Page</h1>

            {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
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
                    <label htmlFor={fieldNames.address}>Address</label>
                    <input
                        name={fieldNames.address}
                        ref={register({ required: true })} 
                    />
                    {errors[fieldNames.address] && <span>Enter your address</span>}
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
                    {/* {searchComponentDecorated} */}
                    <SearchComponent
                        position='topleft'
                        zoom={16}
                        // search={[56, 45.656]}
                        showMarker={true}
                        showPopup={true}
                        // inputPlaceholder={'Search Latitude, Longitude'}
                        closeResultsOnClick={true}
                        // popUp={this.customPopup}
                        // customProvider={osmProviderDecorated}
                        // handler={(obj) => {
                        //     if (obj.event === "add") {
                        //         console.log(obj.payload);
                        //     }
                        // }}
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