const db = require("../models");
const StaticPage = db.static_page;
const TeamMember = db.team_member;
const DiscoverHerContent = db.discover_her_content;
const Event = db.events;
const Membership = db.memberships;
const GetInvolvedProgram = db.get_involved_program;
const { Op } = require("sequelize"); 

// Get all data for the homepage
exports.getHomePageData = async (req, res) => {
  try {
    // Fetch all static pages where key contains 'home'
    const staticPages = await StaticPage.findAll({
      where: {
        key: {
          [Op.like]: '%home%', // Fetch any key that contains 'home'
        },
      },
    });

    // Fetch 3 active team members
    const teamMembers = await TeamMember.findAll({
      where: { is_active: true },
      limit: 3,
    });

    // Fetch 3 trending articles (category = 'article')
    const trendingArticles = await DiscoverHerContent.findAll({
      where: { category: 'article', is_active: true },
      limit: 3,
    });

    // Fetch 3 upcoming events
    const upcomingEvents = await Event.findAll({
      where: { status: 'upcoming' },
      limit: 3,
    });

    // Combine the data into one response
    const responseData = {
      staticPages: staticPages.map(page => ({
        key:page.key,
        title:page.title,
        image: page.image,
        description: page.description,
        button_link: page.button_link,
        button_text: page.button_text,
      })),
      teamMembers: teamMembers.map(member => ({
        title: member.title,
        position: member.position,
        image: member.image,
      })),
      trendingArticles: trendingArticles.map(article => ({
        category: article.category,
        title: article.title,
        description: article.description,
        date: article.date,
        header_file: article.header_file,
      })),
      upcomingEvents: upcomingEvents.map(event => ({
        date: event.date,
        image:event.image,
        status: event.status,
        title: event.title,
        start_time: event.start_time,
        end_time: event.end_time,
        description: event.description,
      })),
    };

    // Send the response data
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving homepage data",
      error: error.message,
    });
  }
};
exports.getGetInvolvedPageData = async (req, res) => {
  try {
    // Fetch all static pages where key contains 'get involved'
    const staticPages = await StaticPage.findAll({
      where: {
        key: {
          [Op.like]: '%Get Involved%', // Fetch any key that contains 'get involved'
        },
      },
    });

    // Fetch 3 memberships with type 'individual'
    const individualMemberships = await Membership.findAll({
      where: { type: 'individual' },
      limit: 3,
      order: [['price', 'ASC']], // Optional: order by price ascending
    });

    // Fetch 3 memberships with type 'corporate'
    const corporateMemberships = await Membership.findAll({
      where: { type: 'corporate' },
      limit: 3,
      order: [['price', 'ASC']], // Optional: order by price ascending
    });

    // Fetch 8 active get_involved_programs
    const programs_initiatives = await GetInvolvedProgram.findAll({
      where: { is_active: true },
      limit: 8,
      order: [['createdAt', 'ASC']], 
    });

    // Combine the data into one response
    const responseData = {
      staticPages: staticPages.map(page => ({
        key: page.key,
        title: page.title,
        image: page.image,
        description: page.description,
        button_link: page.button_link,
        button_text: page.button_text,
      })),
      memberships: {
        individual: individualMemberships.map(membership => ({
          title: membership.title,
          description: membership.description,
          type: membership.type,
          start_date: membership.start_date,
          expiry_date: membership.expiry_date,
          price: membership.price,
        })),
        corporate: corporateMemberships.map(membership => ({ 
          title: membership.title,
          description: membership.description,
          type: membership.type,
          start_date: membership.start_date,
          expiry_date: membership.expiry_date,
          price: membership.price,
        })),
      },
      programsInitiatives: programs_initiatives.map(program => ({
      
        icon: program.icon,
        title: program.title,
        description: program.description,
        is_active: program.is_active,
      
      })),
    };

    // Send the response data
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving get involved page data",
      error: error.message,
    });
  }
};