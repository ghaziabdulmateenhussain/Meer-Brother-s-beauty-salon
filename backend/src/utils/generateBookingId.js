// Produces IDs like MB-4F82A1 - short, unique-enough, human readable.
function generateBookingId() {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `MB-${random}`;
}

module.exports = generateBookingId;
