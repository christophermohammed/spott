export const errors = {
    // AUTH
    INVALID_EMAIL: "Invalid email address",
    INVALID_PASSWORD: "Password length too short",
    INVALID_USER_NAME: "Neither first name nor last name can be empty",
    PASSWORD_MISMATCH: "Password and confirmed password don't match",

    // ADD-LOCATION
    POSITION_MISSING: "A position on the map must be selected",
    INVALID_LOCATION_NAME_OR_DESCRIPTION: "Neither name nor description can be empty",
    SHORT_DESCRIPTION: "Description must be at least 100 characters long",

    // ADD MEDIA
    LOCATION_MISSING: "A location on the map must be selected",

    // USER SERVICES
    CREATE_USER: "Unable to create user successfully",
    LOGIN: "Unable to login successfully",
    LOGOUT: "Unable to logout successfully",
    LOGOUT_ALL: "Unable to log out of all sessions successfully",
    UPDATE_USER: "Unable to update user. ",

    // MEDIA SERVICES
    SET_MEDIA: "Unable to add media. Make sure file is the right size and format.",
    GET_MEDIA_FOR_ADMIN: "Unable to retrieve media. ",
    UPDATE_MEDIA: "Unable to update media. ",
    DELETE_MEDIA: "Unable to delete media. ",

    // LOCATION SERVICES
    SET_LOCATION: "Unable to add location. ",
    GET_LOCATIONS: "Unable to retrieve locations",
    GET_MEDIA_FOR_LOCATION: "Unable to retrieve media for this location",
    UPDATE_LOCATION: "Unable to update location. ",
    DELETE_LOCATION: "Unable to delete location. ",

    // TOP BAR
    ADD_PHOTO_MISSING_AUTH: "You have to be logged in to add a photo",
    VOTE_MISSING_AUTH: "You have to be logged in to upvote / downvote",

    // PHONE NUMBER
    INVALID_PHONE_NUMBER: "Invalid phone number. (Should be at least 10 digits long)",
    SEND_MESSAGE: "Unable to send message",

    // COUNTRIES
    MISSING_PLACE_DATA: "Could not retrieve place data",
    MISSING_FAVOURITE_PLACE: "You must select a favourite place"
};

export const general = {
    // MEDIA UPLOAD
    UPLOAD_THANKS: "Thank you for your upload! You should be able to see it soon once it has been approved"
};