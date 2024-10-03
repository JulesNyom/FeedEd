import admin from 'firebase-admin';

async function sendEmail(mailjet, userEmail, userName, studentEmail, studentName, subject, textContent, htmlContent) {
  return mailjet
    .post("send", {'version': 'v3.1'})
    .request({
      "Messages":[
        {
          "From": {
            "Email": userEmail,
            "Name": userName
          },
          "To": [
            {
              "Email": studentEmail,
              "Name": studentName
            }
          ],
          "Subject": subject,
          "TextPart": textContent,
          "HTMLPart": htmlContent
        }
      ]
    });
}

async function processPrograms(db, mailjet) {
  console.log('Starting to process programs...');
  const usersSnapshot = await db.collection('users').get();

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const userData = userDoc.data();
    const userEmail = userData.email;
    const userName = userData.displayName || 'User';

    const programsSnapshot = await db.collection(`users/${userId}/programs`).get();

    for (const programDoc of programsSnapshot.docs) {
      const program = { id: programDoc.id, ...programDoc.data() };
      const currentDate = new Date();
      const endDate = new Date(program.endDate);
      const daysSinceEnd = Math.floor((currentDate - endDate) / (1000 * 60 * 60 * 24));

      const studentsSnapshot = await db.collection(`users/${userId}/programs/${program.id}/students`).get();

      for (const studentDoc of studentsSnapshot.docs) {
        const student = { id: studentDoc.id, ...studentDoc.data() };
        const studentName = `${student.firstName} ${student.lastName}`;

        if (program.status === "Terminé" && daysSinceEnd >= 1 && !student.hotEmailSent) {
          const subject = "Merci pour votre participation";
          const textContent = `Cher(e) ${studentName},\n\nMerci d'avoir participé à notre programme de formation "${program.name}". Nous espérons que vous avez trouvé cette expérience enrichissante.\n\nCordialement,\nL'équipe de formation`;
          const htmlContent = `<p>Cher(e) ${studentName},</p><p>Merci d'avoir participé à notre programme de formation "${program.name}". Nous espérons que vous avez trouvé cette expérience enrichissante.</p><p>Cordialement,<br>L'équipe de formation</p>`;

          try {
            await sendEmail(mailjet, userEmail, userName, student.email, studentName, subject, textContent, htmlContent);
            await db.doc(`users/${userId}/programs/${program.id}/students/${student.id}`).update({
              hotEmailSent: true,
              hotEmailSentDate: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`Hot email sent successfully to student ${student.id} for program ${program.id}`);
          } catch (error) {
            console.error(`Failed to send hot email to student ${student.id} for program ${program.id}:`, error);
          }
        }

        const programDuration = Math.floor((endDate - new Date(program.startDate)) / (1000 * 60 * 60 * 24));
        if (programDuration > 60 && daysSinceEnd >= 90 && !student.coldEmailSent) {
          const subject = "Suivi de votre formation";
          const textContent = `Cher(e) ${studentName},\n\n90 jours se sont écoulés depuis la fin de votre formation "${program.name}". Nous espérons que les compétences acquises vous sont utiles dans votre travail quotidien.\n\nCordialement,\nL'équipe de formation`;
          const htmlContent = `<p>Cher(e) ${studentName},</p><p>90 jours se sont écoulés depuis la fin de votre formation "${program.name}". Nous espérons que les compétences acquises vous sont utiles dans votre travail quotidien.</p><p>Cordialement,<br>L'équipe de formation</p>`;

          try {
            await sendEmail(mailjet, userEmail, userName, student.email, studentName, subject, textContent, htmlContent);
            await db.doc(`users/${userId}/programs/${program.id}/students/${student.id}`).update({
              coldEmailSent: true,
              coldEmailSentDate: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`Cold email sent successfully to student ${student.id} for program ${program.id}`);
          } catch (error) {
            console.error(`Failed to send cold email to student ${student.id} for program ${program.id}:`, error);
          }
        }
      }
    }
  }
}

module.exports = { processPrograms };