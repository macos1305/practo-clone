async function findSlotById(slotId) {
    return SlotModel.findById(slotId);
}