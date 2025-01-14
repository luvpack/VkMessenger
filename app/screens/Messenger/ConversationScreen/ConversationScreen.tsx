import {
  KeyboardAvoidingView,
  TextInput,
  View,
  StyleSheet,
  PlatformColor,
  TouchableHighlight,
} from "react-native"
import React, { useRef, useState } from "react"
import Messages from "../../../features/MessagesList"
import { MessagesMessage } from "../../../types/vk"
import { useDispatch, useSelector } from "react-redux"
import { Dispatch, RootState } from "../../../models"
import { TextField } from "../../../components/TextField/TextField"
import { SafeAreaView } from "react-native-safe-area-context"
import Icon from "react-native-vector-icons/Feather"
import { BView } from "../../../components/BlurView/BlurView"

const getNewMessageId = (lastMessageId) => {
  if (!lastMessageId || lastMessageId < 0) {
    return 0
  }

  return lastMessageId + 1
}

const ConversationScreen = (props) => {
  const messageInputRef = useRef<TextInput>(null)
  const peerId = props.route.params.conversation.peer.id

  const dispatch = useDispatch<Dispatch>()

  const lastMessageId = useSelector<RootState, number | null>((state) => {
    const history = state.history.items[peerId]

    if (!history) return null

    const messages = history.items

    return messages[0].id
  })

  const myId = useSelector<RootState>((state) => state.user.user_data?.id)
  const [textMessage, setTextMessage] = useState<string>("")

  const onMessageSend = () => {
    if (textMessage === "") return

    setTextMessage("")
    messageInputRef.current?.clear()
    setTimeout(() => messageInputRef.current?.focus(), 100)

    const rid = Math.ceil(Date.now() / 1000)

    dispatch.history.sendMessage({
      message: {
        random_id: rid,
        id: rid,
        peer_id: peerId,
        from_id: myId,
        text: textMessage,
        date: Date.now() / 1000,
        attachments: [],
      } as MessagesMessage,
    })
  }

  return (
    <KeyboardAvoidingView behavior={"padding"} keyboardVerticalOffset={0}>
      <View style={styles.conversationContainer}>
        <Messages peer_id={peerId} />
        <BView>
          <SafeAreaView style={styles.footerContainer} edges={["bottom"]}>
            <View style={styles.footerAction}>
              <View
                style={{
                  // backgroundColor: textMessage.length === 0 ? 'transparent' : PlatformColor('link'),
                  padding: 6,
                  borderRadius: 60,
                }}
              >
                <Icon name={"paperclip"} size={20} color={PlatformColor("link")} />
              </View>
            </View>
            <View>
              <TextField
                ref={messageInputRef}
                //autoFocus={true}
                style={styles.messageInput}
                // onSubmitEditing={}
                value={textMessage}
                onChangeText={(text) => setTextMessage(text)}
                placeholder={"Сообщение"}
                variant={"primary"}
                multiline={true}
                textAlignVertical={"center"}
                textBreakStrategy={"highQuality"}
                scrollEnabled={true}
                collapsable={true}
                numberOfLines={6}
                keyboardType={"default"}
                // returnKeyType={'next'}
              />
            </View>
            <View style={styles.footerAction}>
              <TouchableHighlight
                onPress={onMessageSend}
                underlayColor={PlatformColor("secondarySystemBackground")}
              >
                <View
                  style={{
                    backgroundColor:
                      textMessage.length === 0 ? "transparent" : PlatformColor("link"),
                    padding: 6,
                    borderRadius: 60,
                  }}
                >
                  {textMessage.length === 0 ? (
                    <Icon name={"mic"} size={20} color={PlatformColor("link")} />
                  ) : (
                    <Icon name={"corner-right-up"} size={16} color={"white"} />
                  )}
                </View>
              </TouchableHighlight>
            </View>
          </SafeAreaView>
        </BView>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  conversationContainer: {
    flexDirection: "column",
    height: "100%",
    paddingTop: 50,
    // flexGrow: 1,
    // overflow: "hidden",
  },
  footerContainer: {
    flexGrow: 0,
    flexShrink: 2,
    flex: 0,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingVertical: 5,
    maxWidth: "100%",
    // backgroundColor: 'transparent'
    // paddingVertical: 5,
  },
  footerAction: {
    flexGrow: 1,
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 0,
    maxHeight: 32,
  },
  messageInput: {
    //maxWidth: '100%',
    //minWidth: '100%',
    // padding: 10,
    width: 300,
    margin: 0,
    //minHeight: 15,
    // height: 30,
    maxHeight: 80,
    // flexGrow: 1,
    flexShrink: 1,
    alignItems: "center",
    textAlignVertical: "center",
  },
})

export default ConversationScreen
