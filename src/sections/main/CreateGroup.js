import React, { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
} from "@mui/material";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider from "../../components/hook-form/FormProvider";
import { RHFTextField } from "../../components/hook-form";
import RHFAutocomplete from "../../components/hook-form/RHFAutocomplete";
import { socket } from "../../socket";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { SelectGroupConversation } from "../../redux/slices/chat";
import { FetchFriends } from "../../redux/slices/users";
import { FriendElement } from "../../components/UserElement";
const user_id = window.localStorage.getItem("user_id");
// let MEMBERS;
// const FriendsList = ({ handleClose }) => {
//   const dispatch = useDispatch();

//   const { friends } = useSelector((state) => state.users);

//   useEffect(() => {
//     dispatch(FetchFriends());
//   }, []);
//   MEMBERS = friends;
//   return (
//     <>
//       {friends?.map((el, idx) => {
//         return <FriendElement key={idx} {...el} handleClose={handleClose} />;
//       })}
//     </>
//   );
// };
const MEMBERS = ["Someone Someone"];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateFormGroup = ({ handleClose }) => {
  const dispatch = useDispatch();

  const NewGroupSchema = Yup.object().shape({
    title: Yup.string().required("Group Title is required"),
    members: Yup.array().min(1, "Must have at least a member"),
    owner: Yup.string(),
  });

  const defaultValues = {
    title: "",
    members: [],
    owner: user_id,
  };

  const methods = useForm({
    resolver: yupResolver(NewGroupSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful, isValid },
  } = methods;

  const onSubmit = async (data) => {
    try {
      // API Call
      socket.emit("createRoom", data, () => {
        dispatch(SelectGroupConversation({ group_room_id: null }));
        toast.success("Group created successful");
        handleClose();
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {/* // <FormProvider onSubmit={handleRoomCreation}> */}
      <Stack spacing={3}>
        <RHFTextField
          name="title"
          // onChange={(e) => setRoomName(e.target.value)}
          label="title"
        />
        <RHFAutocomplete
          name="members"
          label="members"
          multiple
          freeSolo
          options={MEMBERS.map((option) => option)}
          ChipProps={{ size: "medium" }}
        />

        <Stack
          spacing={2}
          direction="row"
          alignItems={"center"}
          justifyContent="end"
        >
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Create
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

const CreateGroup = ({ open, handleClose }) => {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      sx={{ p: 4 }}
    >
      <DialogTitle sx={{ mb: 3 }}>Create New Group</DialogTitle>
      <DialogContent>
        <CreateFormGroup handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroup;
