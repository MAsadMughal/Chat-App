export default function ShowToast(toast, title, description, status) {
    toast({
        title: title,
        description: description,
        status: status,
        duration: 2000,
        isClosable: true,
    });
}
