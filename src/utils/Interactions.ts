export interface InteractionResponse {
    type: InteractionResponseType;
}
export enum InteractionResponseTypes {
    /**
     * ACK a Ping
     */
    Pong = 1,
    /**
     * respond to an interaction with a message
     */
    ChannelMessageWithSource = 4,
    /**
     * ACK an interaction and edit a response later, the user sees a loading state
     */
    DeferredChannelMessageWithSource,
    /**
     * for components, ACK an interaction and edit the original message later; the user does not see a loading state
     */
    DeferredUpdateMessage,
    /**
     * for components, edit the message the component was attached to
     */
    UpdateMessage
}
export type InteractionResponseType = keyof typeof InteractionResponseTypes;